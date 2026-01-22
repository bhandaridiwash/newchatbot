import { detectIntentAndRespond } from '../ai/intentEngine.js';
import { validateToolCall } from '../ai/validator.js';
import { generateToolResponse } from '../ai/responseGenerator.js';
import {
  sendMessage,
  sendListMessage,
  sendButtonMessage,
  sendCarouselMessage,
  sendOrderConfirmationMessage,
  sendLocationRequest
} from '../services/response.js';
import * as restaurantTools from '../tools/restaurant.tools.js';

// Tool execution handlers
const toolHandlers = {
  // Step 1: Show food category menu (List Message) - FROM DATABASE
  show_food_menu: async (args, userId, context) => {
    try {
      // Fetch categories from database
      const categories = await restaurantTools.getMenu();

      const categoryEmojis = {
        'momos': '🥟',
        'noodles': '🍜',
        'rice': '🍚',
        'beverages': '☕'
      };

      // Build category rows (WhatsApp list rows only support id, title, description)
      const rows = categories.map(cat => ({
        id: `cat_${cat.category}`,
        title: `${cat.category.charAt(0).toUpperCase() + cat.category.slice(1)} ${categoryEmojis[cat.category] || '🍽️'}`,
        description: `Browse our ${cat.category} options`
      }));

      const sections = [
        {
          title: 'Food Categories',
          rows: rows.length > 0 ? rows : [
            { id: 'cat_momos', title: 'Momos 🥟', description: 'Steamed, fried, tandoori varieties' }
          ]
        }
      ];

      await sendListMessage(
        userId,
        context.platform,
        '🍽️ Restaurant Menu',
        'Welcome! What would you like to order today? Browse our delicious categories below.',
        'Tap to view options',
        'View Categories',
        sections
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          stage: 'viewing_menu',
          lastAction: 'show_food_menu'
        }
      };
    } catch (error) {
      console.error('Error fetching menu:', error);
      await sendMessage(userId, context.platform, "Sorry, I couldn't load the menu. Please try again.");
      return { reply: null, updatedContext: context };
    }
  },

  // Step 2: Show items in a category - FROM DATABASE (as list message)
  show_category_items: async (args, userId, context) => {
    try {
      const category = args.category || 'momos';
      const foods = await restaurantTools.getMenu(category);

      if (foods.length === 0) {
        await sendMessage(userId, context.platform, `No items found in ${category}. Try another category!`);
        return await toolHandlers.show_food_menu({}, userId, context);
      }

      // Show current cart summary if items exist
      const cart = context.cart || [];
      const categoryEmoji = {
        'momos': '🥟',
        'noodles': '🍜',
        'rice': '🍚',
        'beverages': '☕'
      }[category] || '🍽️';

      let bodyText = `Browse our delicious ${category}! Select any item to add it to your cart.`;
      if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        bodyText = `🛒 Cart: ${itemCount} item(s) - Rs.${total}\n\nSelect items to add:`;
      }

      // Build list rows (max 10 items per WhatsApp limit)
      // Note: WhatsApp list rows only support id, title, description (no imageUrl)
      // However, we include imageUrl for Messenger generic template which DOES support images
      const rows = foods.slice(0, 10).map(food => ({
        id: `add_${food.id}`,
        title: food.name.substring(0, 24), // WhatsApp limit: 24 chars
        description: `Rs.${food.price} - ${(food.description || '').substring(0, 60)}`, // WhatsApp limit: 72 chars
        imageUrl: food.image_url || null  // Pass DB image for Messenger generic template
      }));

      const sections = [
        {
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} ${categoryEmoji}`,
          rows: rows
        }
      ];

      await sendListMessage(
        userId,
        context.platform,
        `${categoryEmoji} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        bodyText,
        'Tap to add items to cart',
        'Select Item',
        sections
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          stage: 'viewing_items',
          currentCategory: category,
          lastAction: 'show_category_items',
          cart: context.cart || []
        }
      };
    } catch (error) {
      console.error('Error fetching category items:', error);
      await sendMessage(userId, context.platform, "Sorry, I couldn't load the items. Please try again.");
      return { reply: null, updatedContext: context };
    }
  },

  // Backward compatibility - show_momo_varieties calls show_category_items
  show_momo_varieties: async (args, userId, context) => {
    return await toolHandlers.show_category_items({ category: 'momos' }, userId, context);
  },

  // Add item to cart - uses database to get item details (IMPROVED: Quick add with quantity options)
  add_to_cart: async (args, userId, context) => {
    try {
      const foodId = args.foodId;
      const quantity = args.quantity || 1;
      const cart = context.cart || [];

      // Get food details from database
      const food = await restaurantTools.getFoodById(foodId);

      if (!food) {
        await sendMessage(userId, context.platform, "Sorry, that item is not available.");
        return { reply: null, updatedContext: context };
      }

      // Check if item already in cart
      const existingItem = cart.find(item => item.foodId === foodId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          foodId: food.id,
          name: food.name,
          price: parseFloat(food.price),
          quantity
        });
      }

      // Calculate cart total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

      // Show quick action buttons - makes adding more items much easier!
      const buttons = [
        {
          type: 'reply',
          reply: {
            id: `more_${context.currentCategory || 'momos'}`,
            title: 'Add More ➕'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'view_all_categories',
            title: 'Other Categories 📋'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'proceed_checkout',
            title: 'Checkout 🛒'
          }
        }
      ];

      await sendButtonMessage(
        userId,
        context.platform,
        '✅ Added to Cart!',
        `*${food.name}* x${quantity} - Rs.${food.price * quantity}\n\n🛒 Cart: ${itemCount} item(s) | Total: Rs.${total}\n\nWhat would you like to do?`,
        'Keep adding or checkout!',
        buttons
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          cart,
          stage: 'quick_cart_action',
          lastAddedItem: food.name,
          lastAction: 'add_to_cart'
        }
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      await sendMessage(userId, context.platform, "Sorry, couldn't add that item. Please try again.");
      return { reply: null, updatedContext: context };
    }
  },

  // Add item by name - validates against database before adding
  add_item_by_name: async (args, userId, context) => {
    try {
      let itemName = args.name || args.itemName || '';
      const quantity = args.quantity || 1;
      const cart = context.cart || [];

      // 1. Handle "add it" / "add this" context from recommendations
      const isGenericReference = ['it', 'this', 'that', 'recommendation', 'recommended item', 'the item'].some(ref =>
        itemName.toLowerCase().includes(ref)
      );

      if (isGenericReference && context.recommendations && context.recommendations.length > 0) {
        // Use the most recent recommended item
        const recommendedItem = context.recommendations[0];
        console.log(`Contextual add: Replacing "${itemName}" with "${recommendedItem.name}"`);
        itemName = recommendedItem.name;
      }

      if (!itemName) {
        await sendMessage(userId, context.platform, "Please specify which item you want to add.");
        return { reply: null, updatedContext: context };
      }

      // Search for the item in database
      const matchingItems = await restaurantTools.getFoodByName(itemName);

      // If no direct match, try checking recommendations again as a fallback
      if (matchingItems.length === 0 && context.recommendations && context.recommendations.length > 0) {
        // Maybe the user said "add the spicy one" and our recommendation list has it
        // This is a simple heuristic: if only one recommendation exists, assume they meant that.
        if (context.recommendations.length === 1) {
          const fallbackItem = context.recommendations[0];
          console.log(`Fallback add: assuming user meant recommended "${fallbackItem.name}"`);
          matchingItems.push(fallbackItem);
        }
      }

      if (matchingItems.length === 0) {
        // Item not found - show helpful message
        await sendMessage(userId, context.platform,
          `❌ Sorry, "${itemName}" is not available on our menu.\n\nType "menu" to see what we have! 🍽️`
        );
        return { reply: null, updatedContext: context };
      }

      if (matchingItems.length === 1) {
        // Exact match - add directly
        const food = matchingItems[0];

        const existingItem = cart.find(item => item.foodId === food.id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({
            foodId: food.id,
            name: food.name,
            price: parseFloat(food.price),
            quantity
          });
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        const buttons = [
          {
            type: 'reply',
            reply: {
              id: `more_${food.category || 'momos'}`,
              title: 'Add More ➕'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'view_all_categories',
              title: 'Other Categories 📋'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'proceed_checkout',
              title: 'Checkout 🛒'
            }
          }
        ];

        await sendButtonMessage(
          userId,
          context.platform,
          '✅ Added to Cart!',
          `*${food.name}* x${quantity} - Rs.${food.price * quantity}\n\n🛒 Cart: ${itemCount} item(s) | Total: Rs.${total}\n\nWhat would you like to do?`,
          'Keep adding or checkout!',
          buttons
        );

        return {
          reply: null,
          updatedContext: {
            ...context,
            cart,
            stage: 'quick_cart_action',
            lastAddedItem: food.name,
            lastAction: 'add_item_by_name'
          }
        };
      }

      // Multiple matches - show options
      const rows = matchingItems.slice(0, 10).map(food => ({
        id: `add_${food.id}`,
        title: food.name.substring(0, 24),
        description: `Rs.${food.price} - ${(food.description || '').substring(0, 50)}`
      }));

      await sendListMessage(
        userId,
        context.platform,
        '🔍 Multiple Matches Found',
        `Found ${matchingItems.length} item(s) matching "${itemName}".\nSelect the one you want:`,
        'Tap to add to cart',
        'Select Item',
        [{ title: 'Matching Items', rows }]
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          stage: 'selecting_item',
          lastAction: 'add_item_by_name'
        }
      };
    } catch (error) {
      console.error('Error adding item by name:', error);
      await sendMessage(userId, context.platform, "Sorry, couldn't find that item. Try browsing our menu!");
      return { reply: null, updatedContext: context };
    }
  },

  // Add multiple items at once - great for batch ordering!
  add_multiple_items: async (args, userId, context) => {
    try {
      const items = args.items || [];
      let cart = context.cart || [];
      const addedItems = [];
      const notFoundItems = [];

      if (items.length === 0) {
        await sendMessage(userId, context.platform, "Please specify which items you want to add.");
        return { reply: null, updatedContext: context };
      }

      console.log(`🛒 Adding multiple items:`, items);

      // Process each item
      for (const item of items) {
        const itemName = item.name || '';
        const quantity = item.quantity || 1;

        if (!itemName) continue;

        // Search for the item in database
        const matchingItems = await restaurantTools.getFoodByName(itemName);

        if (matchingItems.length === 0) {
          notFoundItems.push(itemName);
          continue;
        }

        // Use best match (first result)
        const food = matchingItems[0];

        // Check if item already in cart
        const existingItem = cart.find(cartItem => cartItem.foodId === food.id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({
            foodId: food.id,
            name: food.name,
            price: parseFloat(food.price),
            quantity
          });
        }

        addedItems.push({
          name: food.name,
          quantity,
          price: food.price,
          subtotal: food.price * quantity
        });
      }

      // Build response
      if (addedItems.length === 0) {
        await sendMessage(userId, context.platform,
          `❌ Sorry, none of these items are available:\n${notFoundItems.map(n => `• ${n}`).join('\n')}\n\nType "menu" to see what we have! 🍽️`
        );
        return { reply: null, updatedContext: context };
      }

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

      // Build added items summary
      const addedSummary = addedItems.map(item =>
        `✓ ${item.name} x${item.quantity} - Rs.${item.subtotal}`
      ).join('\n');

      let message = `*${addedItems.length} item(s) added!*\n\n${addedSummary}`;

      // Mention not found items if any
      if (notFoundItems.length > 0) {
        message += `\n\n⚠️ Not available:\n${notFoundItems.map(n => `• ${n}`).join('\n')}`;
      }

      message += `\n\n━━━━━━━━━━━━━━━\n🛒 Cart: ${itemCount} item(s)\n💰 Total: Rs.${total}`;

      const buttons = [
        {
          type: 'reply',
          reply: {
            id: 'view_all_categories',
            title: 'Add More 📋'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'proceed_checkout',
            title: 'Checkout 🛒'
          }
        }
      ];

      await sendButtonMessage(
        userId,
        context.platform,
        '✅ Items Added to Cart!',
        message,
        'Continue shopping or checkout!',
        buttons
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          cart,
          stage: 'quick_cart_action',
          lastAction: 'add_multiple_items'
        }
      };
    } catch (error) {
      console.error('Error adding multiple items:', error);
      await sendMessage(userId, context.platform, "Sorry, couldn't add those items. Please try again.");
      return { reply: null, updatedContext: context };
    }
  },

  // Show cart and checkout options
  show_cart_options: async (args, userId, context) => {
    const cart = context.cart || [];

    if (cart.length === 0) {
      await sendMessage(userId, context.platform, "Your cart is empty! Let me show you our menu.");
      return await toolHandlers.show_food_menu({}, userId, context);
    }

    const cartLines = cart.map(item =>
      `• ${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`
    ).join('\n');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'add_more_items',
          title: 'Add More Items ➕'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'proceed_checkout',
          title: 'Checkout 🛒'
        }
      }
    ];

    await sendButtonMessage(
      userId,
      context.platform,
      '🛒 Your Cart',
      `${cartLines}\n━━━━━━━━━━━━━━━\nSubtotal: Rs.${total}\n\nWould you like to add more items or proceed to checkout?`,
      'You can add more items anytime!',
      buttons
    );

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'cart_options',
        lastAction: 'show_cart_options'
      }
    };
  },

  // Confirm order with payment options
  confirm_order: async (args, userId, context) => {
    const safeArgs = args || {};
    let items = safeArgs.items || context.cart || [];

    if (items.length === 0) {
      await sendMessage(userId, context.platform, "Your cart is empty! Let me show you our menu.");
      return await toolHandlers.show_food_menu({}, userId, context);
    }

    // VALIDATE ITEMS AGAINST DATABASE - filter out items that don't exist
    const validatedItems = [];
    const invalidItems = [];

    for (const item of items) {
      // If item has foodId, validate by ID
      if (item.foodId) {
        const dbItem = await restaurantTools.getFoodById(item.foodId);
        if (dbItem) {
          validatedItems.push({
            foodId: dbItem.id,
            name: dbItem.name,
            price: parseFloat(dbItem.price),
            quantity: item.quantity || 1
          });
        } else {
          invalidItems.push(item.name);
        }
      } else {
        // Item from LLM - validate by name
        const matches = await restaurantTools.getFoodByName(item.name);
        if (matches.length > 0) {
          // Use the first exact or closest match
          const dbItem = matches[0];
          const existingValid = validatedItems.find(v => v.foodId === dbItem.id);
          if (existingValid) {
            existingValid.quantity += item.quantity || 1;
          } else {
            validatedItems.push({
              foodId: dbItem.id,
              name: dbItem.name,
              price: parseFloat(dbItem.price), // Use DB price, not LLM-generated
              quantity: item.quantity || 1
            });
          }
        } else {
          invalidItems.push(item.name);
        }
      }
    }

    // If no valid items after validation
    if (validatedItems.length === 0) {
      await sendMessage(userId, context.platform,
        `❌ Sorry, none of the items are available:\n${invalidItems.map(n => `• ${n}`).join('\n')}\n\nType "menu" to see what we have! 🍽️`
      );
      return await toolHandlers.show_food_menu({}, userId, context);
    }

    // Notify about invalid items if any
    if (invalidItems.length > 0) {
      await sendMessage(userId, context.platform,
        `⚠️ Note: These items are not available and were removed:\n${invalidItems.map(n => `• ${n}`).join('\n')}`
      );
    }

    // Use validated items
    items = validatedItems;

    const orderLines = items.map(item =>
      `• ${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`
    ).join('\n');

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = `${orderLines}\n━━━━━━━━━━━━━━━\nTotal: Rs.${total}`;

    await sendOrderConfirmationMessage(userId, context.platform, orderDetails);

    return {
      reply: null,
      updatedContext: {
        ...context,
        cart: items, // Update cart with validated items
        stage: 'confirming_order',
        lastAction: 'confirm_order',
        pendingOrder: { items, total }
      }
    };
  },

  // Show Payment Options for Dine-in (Cash Counter / Online)
  show_dine_in_payment_options: async (args, userId, context) => {
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'pay_cash_counter',
          title: 'Cash at Counter 💵'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'pay_online',
          title: 'Online Payment 📱'
        }
      }
    ];

    await sendButtonMessage(
      userId,
      context.platform,
      '💳 Payment Method (Dine-in)',
      'How would you like to pay for your dine-in order?',
      'Select to continue',
      buttons
    );

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'selecting_payment',
        lastAction: 'show_dine_in_payment_options'
      }
    };
  },

  // New Handler: Welcome Message
  show_welcome_message: async (args, userId, context) => {
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'view_all_categories',
          title: 'View Menu 🍽️'
        }
      }
    ];

    await sendButtonMessage(
      userId,
      context.platform,
      '👋 Welcome to Momo House!',
      'We serve the best foods in town. Browse our menu to order now!',
      'Tap to start',
      buttons
    );

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'initial',
        lastAction: 'show_welcome_message'
      }
    };
  },

  // New Handler: Collect Party Size (Step 1 of Reservation)
  collect_party_size: async (args, userId, context) => {
    await sendMessage(userId, context.platform,
      "🍽️ *Dine-in Reservation*\n\nHow many people are coming? (Please type a number, e.g., '4')"
    );

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'collecting_party_size',
        lastAction: 'collect_party_size'
      }
    };
  },

  // New Handler: Collect Arrival Time (Step 2 of Reservation)
  collect_arrival_time: async (args, userId, context) => {
    const partySize = args.partySize;

    // Determine today's date context
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric' });

    await sendMessage(userId, context.platform,
      `🕒 *Arrival Time*\n\nGreat! Table for ${partySize}. What time will you arrive today?\n(e.g., "7:30 PM" or "19:30")`
    );

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'collecting_arrival_time',
        reservation: { ...context.reservation, partySize },
        number_of_people: partySize, // Save to DB column
        lastAction: 'collect_arrival_time'
      }
    };
  },

  // New Handler: Confirm Reservation & Deposit (Step 3)
  confirm_reservation_deposit: async (args, userId, context) => {
    const arrivalTime = args.arrivalTime;
    const { partySize } = context.reservation || {};
    const cartTotal = context.pendingOrder?.total || 0;

    // Ensure we claim service_type = 'dine_in' now that we have data (will be saved in updatedContext)
    context.service_type = 'dine_in';
    context.delivery_address = null; // Clear address for constraint satisfaction

    // Deposit calculation: 20% of total
    const depositAmount = Math.ceil(cartTotal * 0.20);

    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'confirm_deposit',
          title: 'Confirm & Pay 💰'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'cancel_order',
          title: 'Cancel ❌'
        }
      }
    ];

    await sendButtonMessage(
      userId,
      context.platform,
      '📝 Reservation Summary',
      `👤 Party Size: ${partySize}\n🕒 Time: ${arrivalTime}\n\n⚠️ *Deposit Required*\nTo confirm your table, we require a 20% deposit.\n\n💰 Total Order: Rs.${cartTotal}\n💳 *Deposit Amount: Rs.${depositAmount}*\n\nℹ️ _This deposit is refundable if cancelled 3+ hours before booking time._`,
      'Confirm to proceed',
      buttons
    );

    // Parse time for DB
    let dine_time = null;
    try {
      // Parse time from formats like "5pm", "5:30pm", "17:30", "7:30 PM", etc.
      const timeStr = arrivalTime.trim().toLowerCase();
      const now = new Date();

      // Extract hour and minute using regex
      let hour = null;
      let minute = 0;

      // Match patterns: "5pm", "5:30pm", "17:30", "7:30 PM", etc.
      const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/);
      if (match) {
        hour = parseInt(match[1]);
        minute = match[2] ? parseInt(match[2]) : 0;
        const meridiem = match[3];

        // Convert 12-hour to 24-hour if needed
        if (meridiem === 'pm' && hour !== 12) {
          hour += 12;
        } else if (meridiem === 'am' && hour === 12) {
          hour = 0;
        }
      }

      // If parsing succeeded, create the timestamp
      if (hour !== null && hour >= 0 && hour < 24) {
        const parsedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
        dine_time = parsedDate.toISOString();
      } else {
        console.warn("Failed to parse dine_time:", arrivalTime);
      }
    } catch (e) {
      console.error("Error parsing dine_time:", e);
    }

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'confirming_deposit',
        reservation: { ...context.reservation, arrivalTime, depositAmount },
        dine_time: dine_time, // Save to DB column
        lastAction: 'confirm_reservation_deposit'
      }
    };
  },

  // Show payment method selection buttons for DELIVERY
  show_payment_options: async (args, userId, context) => {
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'pay_cod',
          title: 'Cash on Delivery 💵'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'pay_online',
          title: 'Online Payment 📱'
        }
      }
    ];

    await sendButtonMessage(
      userId,
      context.platform,
      '💳 Payment Method (Delivery)',
      'Choose your preferred payment method:',
      'Select to continue',
      buttons
    );

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'selecting_payment',
        lastAction: 'show_payment_options'
      }
    };
  },

  // Process order confirmation - saves to DATABASE
  process_order_response: async (args, userId, context) => {
    const { action } = args;

    if (action === 'confirmed') {
      try {
        const cart = context.cart || [];

        if (cart.length === 0) {
          await sendMessage(userId, context.platform, "Your cart is empty! Cannot proceed with order.");
          return await toolHandlers.show_food_menu({}, userId, context);
        }

        // Check if service type already selected (e.g., from reservation flow)
        if (context.service_type && context.service_type === 'dine_in') {
          // Service type already selected via reservation - proceed to payment/order completion
          console.log('✅ Order confirmation received with dine_in reservation');

          // Create final order with reservation details
          const orderId = `RES${Date.now().toString().slice(-6)}`;
          const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          // Create reservation record in database
          try {
            const reservation = await restaurantTools.createReservation(
              userId,
              context.number_of_people,
              context.dine_time
            );
            console.log('✅ Reservation created in database:', reservation);
          } catch (error) {
            console.error('Error creating reservation record:', error);
          }

          await sendMessage(userId, context.platform,
            `✅ Reservation Confirmed!\n\nOrder ID: #${orderId}\n🍽️ Service: Dine-in\n👥 Party Size: ${context.number_of_people}\n🕒 Time: ${context.dine_time ? new Date(context.dine_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD'}\n💰 Total: Rs.${orderTotal}\n💳 Deposit Paid: Rs.${Math.ceil(orderTotal * 0.20)}\n\nWe look forward to serving you! 🎉`
          );

          return {
            reply: null,
            updatedContext: {
              ...context,
              stage: 'order_complete',
              lastAction: 'reservation_confirmed',
              cart: [],
              service_type: null,
              number_of_people: null,
              dine_time: null,
              delivery_address: null
            }
          };
        }

        // Don't create order yet - just proceed to service type selection
        // Order will be created only after payment is confirmed
        console.log('✅ Order confirmation received, proceeding to service type selection');

        // Ask for service type instead of payment
        return await toolHandlers.select_service_type({}, userId, {
          ...context,
          stage: 'selecting_service'
        });
      } catch (error) {
        console.error('Error processing order confirmation:', error);
        // Fallback without database
        const orderId = `MH${Date.now().toString().slice(-6)}`;
        await sendMessage(userId, context.platform,
          `✅ Order Confirmed!\n\nThank you for your order! Your delicious food is being prepared and will be delivered in 30-40 minutes.\n\nOrder ID: #${orderId}\n\nEnjoy your meal! 🥟`
        );
        return {
          reply: null,
          updatedContext: {
            stage: 'order_complete',
            lastAction: 'order_confirmed',
            cart: [],
            service_type: null,
            number_of_people: null,
            dine_time: null,
            delivery_address: null,
            payment_method: null
          }
        };
      }
    } else if (action === 'cancel_confirm') {
      // User confirmed cancellation
      const cart = context.cart || [];
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

      await sendMessage(userId, context.platform,
        `❌ Order Cancelled\n\n${itemCount} item(s) removed from cart.\n\nNo worries! Feel free to browse our menu again whenever you're ready.\n\nType "menu" to start a new order! 🍽️`
      );
      return {
        reply: null,
        updatedContext: {
          stage: 'initial',
          lastAction: 'order_cancelled',
          cart: []
        }
      };
    } else {
      // Ask for cancellation confirmation first
      const cart = context.cart || [];
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

      const buttons = [
        {
          type: 'reply',
          reply: {
            id: 'confirm_cancel',
            title: 'Yes, Cancel ❌'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'back_to_cart',
            title: 'No, Go Back 🔙'
          }
        }
      ];

      await sendButtonMessage(
        userId,
        context.platform,
        '⚠️ Cancel Order?',
        `Are you sure you want to cancel?\n\n🛒 Cart: ${itemCount} item(s)\n💰 Total: Rs.${total}\n\nThis will remove all items from your cart.`,
        'Please confirm',
        buttons
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          stage: 'confirming_cancel',
          lastAction: 'ask_cancel_confirmation'
        }
      };
    }
  },

  // Select Service Type (Dine-in vs Delivery)
  select_service_type: async (args, userId, context) => {
    const type = args.type || args.serviceType;

    // Phase 1: Ask user to select
    if (!type) {
      const buttons = [
        {
          type: 'reply',
          reply: {
            id: 'service_dine_in',
            title: 'Dine-in 🍽️'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'service_delivery',
            title: 'Delivery 🛵'
          }
        }
      ];

      await sendButtonMessage(
        userId,
        context.platform,
        '🍽️ Service Type',
        'Would you like to Dine-in or have it Delivered?',
        'Please select one',
        buttons
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          stage: 'selecting_service',
          lastAction: 'ask_service_type'
        }
      };
    }

    // Phase 2: Handle Selection
    if (type === 'dine_in') {
      if (context.orderId) {
        await restaurantTools.updateServiceType(context.orderId, 'dine_in');
        await restaurantTools.updateDeliveryAddress(context.orderId, 'Dine-in');
      }

      // For dine-in, start reservation flow instead of payment options
      // Step 1: Ask for party size
      // NOTE: We set service_type but number_of_people/dine_time are null initially. 
      // The constraint check happens on UPDATE/INSERT. 
      // If we save context NOW, it might fail if we set service_type='dine_in' but don't have other fields yet.
      // So we should probably keep service_type=null (or a temporary value) until we have all data.
      // BUT context.js saves on every update.
      // Strategy: Don't set 'service_type' to 'dine_in' in the DB column yet. Keep it in context.role or similar?
      // OR, update the constraint to allow NULLs during intermediate steps?
      // No, the constraint says valid_service_data.
      // If service_type IS NULL, it's valid.
      // So we should NOT set context.service_type = 'dine_in' yet.
      // We'll set it only when we have all data (at confirm_reservation_deposit).

      return await toolHandlers.collect_party_size({}, userId, {
        ...context,
        // service_type: 'dine_in' // REMOVED to avoid constraint violation before data collection
        _temp_service_type: 'dine_in' // Store temporarily
      });
    } else if (type === 'delivery') {
      await restaurantTools.updateServiceType(context.orderId, 'delivery');

      // Present choice: Share Location vs Type Address
      const buttons = [
        {
          type: 'reply',
          reply: {
            id: 'req_loc_share',
            title: 'Share Location 📍'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'req_loc_type',
            title: 'Type Address ✍️'
          }
        }
      ];

      await sendButtonMessage(
        userId,
        context.platform,
        '📍 Delivery Location',
        'How would you like to provide your delivery address?',
        'Select an option',
        buttons
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          service_type: 'delivery',
          number_of_people: null,
          dine_time: null,
          stage: 'selecting_location_method',
          lastAction: 'ask_location_method'
        }
      };
    }
  },

  // Handle Delivery Location Input
  provide_location: async (args, userId, context) => {
    const address = args.address;
    const location = args.location;

    // Build display address from location object or typed address
    let displayAddress = address;
    let locationData = null;

    if (location) {
      // User shared GPS location via WhatsApp location request
      displayAddress = location.address || location.name ||
        `📍 ${location.latitude}, ${location.longitude}`;
      locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        address: location.address
      };
    }

    if (!displayAddress) {
      await sendMessage(userId, context.platform, "Please provide a valid delivery address or share your location.");
      return { reply: null, updatedContext: context };
    }

    // Confirm address and proceed to payment
    if (context.orderId) {
      await restaurantTools.updateDeliveryAddress(context.orderId, displayAddress);
    }

    await sendMessage(userId, context.platform,
      `✅ Delivery address set to: *${displayAddress}*`
    );

    return await toolHandlers.show_payment_options({}, userId, {
      ...context,
      delivery_address: address
    });
  },

  // Handle Location Method Selection (Share vs Type)
  handle_location_method: async (args, userId, context) => {
    const { method } = args;

    if (method === 'share') {
      // Send native location request
      await sendLocationRequest(userId, context.platform,
        `📍 *Share Location*\n\nPlease tap the button below to share your current GPS location.`
      );
    } else {
      // Ask user to type address manually
      await sendMessage(userId, context.platform,
        `✍️ *Type Address*\n\nPlease type your full delivery address below (e.g., "Kathmandu, New Road"):`
      );
    }

    return {
      reply: null,
      updatedContext: {
        ...context,
        stage: 'providing_location', // Both paths lead to providing_location stage
        lastAction: 'handle_location_method'
      }
    };
  },

  // Process payment selection - saves to DATABASE
  process_payment: async (args, userId, context) => {
    const { method } = args;
    const cart = context.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceType = context.service_type || 'delivery';
    const isDineIn = serviceType === 'dine_in';

    try {
      // Create order from cart only when payment is confirmed
      // This ensures order is placed only after complete flow
      let orderId = null;

      if (cart.length > 0) {
        console.log('🔄 Creating order after payment confirmation...');

        const order = await restaurantTools.finalizeOrderFromCart(userId, cart, {
          service_type: serviceType,
          delivery_address: context.delivery_address,
          payment_method: method,
          platform: context.platform || 'whatsapp'
        });

        orderId = order.id;
        console.log('✅ Order created successfully:', orderId, 'Total:', order.total_amount);

        // Update payment method for the order
        if (orderId) {
          await restaurantTools.selectPayment(orderId, method);
        }
      }

      if (method === 'ONLINE') {
        // Show online payment details with dummy values
        await sendMessage(userId, context.platform,
          `💳 *Online Payment Details*\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n` +
          `📱 *eSewa*\n` +
          `   ID: 9800000001\n` +
          `   Name: Momo House Pvt Ltd\n\n` +
          `📱 *Khalti*\n` +
          `   ID: 9800000002\n` +
          `   Name: Momo House\n\n` +
          `🏦 *Bank Transfer*\n` +
          `   Bank: Nepal Bank Ltd\n` +
          `   A/C: 0123456789012\n` +
          `   Name: Momo House Pvt Ltd\n` +
          `━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `💰 *Amount to Pay: Rs.${total}*\n\n` +
          `📝 Please send payment screenshot to confirm.\n` +
          `Order ID: #${orderId || 'MH' + Date.now().toString().slice(-6)}`
        );

        if (isDineIn) {
          await sendMessage(userId, context.platform,
            `✅ Order Placed!\n\n` +
            `Your order will be prepared once payment is confirmed.\n\n` +
            `🍽️ Please come to our restaurant to enjoy your meal!\n\n` +
            `Preparation time: 15-20 minutes.\n\n` +
            `Thank you for ordering! 🥟`
          );
        } else {
          await sendMessage(userId, context.platform,
            `✅ Order Placed!\n\n` +
            `Your order will be prepared once payment is confirmed.\n\n` +
            `🛵 Delivery: 30-40 minutes after confirmation.\n\n` +
            `Thank you for ordering! 🥟`
          );
        }
      } else {
        // Cash payment (at counter for dine-in, on delivery for delivery)
        if (isDineIn) {
          await sendMessage(userId, context.platform,
            `✅ Order Confirmed!\n\n` +
            `💳 Payment: Cash at Counter\n` +
            `💰 Amount: Rs.${total}\n\n` +
            `Your delicious food is being prepared!\n\n` +
            `🍽️ Please come to our restaurant and pay at the counter.\n\n` +
            `Order ID: #${orderId || 'MH' + Date.now().toString().slice(-6)}\n\n` +
            `Preparation time: 15-20 minutes.\n\n` +
            `Enjoy your meal! 🥟`
          );
        } else {
          await sendMessage(userId, context.platform,
            `✅ Order Confirmed!\n\n` +
            `💳 Payment: Cash on Delivery\n` +
            `💰 Amount: Rs.${total}\n\n` +
            `Your delicious food is being prepared and will be delivered in 30-40 minutes.\n\n` +
            `Order ID: #${orderId || 'MH' + Date.now().toString().slice(-6)}\n\n` +
            `Please keep Rs.${total} ready!\n\nEnjoy your meal! 🥟`
          );
        }
      }

      // Delete session after successful order placement
      try {
        await restaurantTools.deleteSessionAfterOrder(userId);
      } catch (deleteError) {
        console.error('Warning: Could not delete session:', deleteError);
        // Don't fail the order if session deletion fails
      }

      return {
        reply: null,
        updatedContext: {
          ...context,
          stage: 'order_complete',
          lastAction: 'order_confirmed',
          payment_method: null,
          cart: [],
          service_type: null,
          number_of_people: null,
          dine_time: null,
          delivery_address: null
        }
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      await sendMessage(userId, context.platform, "Order confirmed! We'll contact you for payment details.");

      // Don't delete session if order creation failed
      return {
        reply: null,
        updatedContext: {
          stage: 'order_complete',
          cart: [],
          service_type: null,
          number_of_people: null,
          dine_time: null,
          delivery_address: null,
          payment_method: null
        }
      };
    }
  },

  // Handler for cash at counter (Dine-in)
  pay_cash_counter: async (args, userId, context) => {
    // Just reuse process_payment with CASH method
    return await toolHandlers.process_payment({ method: 'CASH_COUNTER' }, userId, context);
  },

  // Show order history
  show_order_history: async (args, userId, context) => {
    try {
      const orders = await restaurantTools.getOrderHistory(userId, 5);

      if (orders.length === 0) {
        await sendMessage(userId, context.platform,
          `📋 *Order History*\n\nYou haven't placed any orders yet!\n\nType "menu" to start your first order! 🍽️`
        );
        return { reply: null, updatedContext: context };
      }

      let historyText = `📋 *Your Order History*\n\n`;

      for (const order of orders) {
        const statusEmoji = {
          'created': '🆕',
          'confirmed': '✅',
          'preparing': '👨‍🍳',
          'delivered': '📦',
          'completed': '✔️',
          'cancelled': '❌'
        }[order.status] || '📝';

        const date = new Date(order.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        historyText += `${statusEmoji} *Order #${order.id}*\n`;
        historyText += `   📅 ${date}\n`;
        historyText += `   🛒 ${order.item_count} item(s) | Rs.${parseFloat(order.total).toFixed(0)}\n`;
        historyText += `   💳 ${order.payment_method || 'Pending'}\n`;
      }

      await sendMessage(userId, context.platform, historyText);

      return {
        reply: null,
        updatedContext: {
          ...context,
          lastAction: 'show_order_history'
        }
      };

    } catch (error) {
      console.error('Error fetching order history:', error);
      await sendMessage(userId, context.platform, "Sorry, I couldn't check your order history right now.");
      return { reply: null, updatedContext: context };
    }
  },

  // Recommend Food
  recommend_food: async (args, userId, context) => {
    try {
      const safeArgs = args || {};
      const tag = safeArgs.tag || 'random';
      console.log(`Getting recommendations for tag: ${tag}`);

      const foods = await restaurantTools.getRecommendedFoods(tag);

      if (foods.length === 0) {
        await sendMessage(userId, context.platform,
          `🤔 I couldn't find any specific items for "${tag}", but we have lots of other delicious options!\n\nType "menu" to see our full range. 🍽️`
        );
        return { reply: null, updatedContext: context };
      }

      // Format as list
      const rows = foods.map(food => ({
        id: `add_${food.id}`,
        title: food.name.substring(0, 24),
        description: `Rs.${food.price} - ${food.category}`
      }));

      // Different title for random
      const isRandom = tag === 'random';
      const title = isRandom ? '🎲 Chef\'s Choice' : `🌟 Recommendations: "${tag}"`;

      // Dynamic Body using LLM
      const body = await generateToolResponse('recommend_food', { tag }, foods, context);

      await sendListMessage(
        userId,
        context.platform,
        title,
        body,
        'Tap to add to cart',
        'View Recommendations',
        [{ title: 'Recommended', rows }]
      );

      return {
        reply: null,
        updatedContext: {
          ...context,
          stage: 'viewing_recommendations',
          lastAction: 'recommend_food',
          recommendations: foods // Save for "add it" context
        }
      };

    } catch (error) {
      console.error('Error getting recommendations:', error);
      await sendMessage(userId, context.platform, "Sorry, I'm having trouble getting recommendations right now.");
      return { reply: null, updatedContext: context };
    }
  },

  // Simple text reply
  send_text_reply: async (args, userId, context) => {
    const message = args.message || "Hello! Welcome to our restaurant 🍽️ Type 'menu' to see our delicious options!";
    console.log(`━━━ SENDING TEXT REPLY ━━━`);
    console.log(`💬 Message: ${message}`);
    await sendMessage(userId, context.platform, message);
    return {
      reply: null,
      updatedContext: context
    };
  }
};

// Handle button/list reply callbacks from WhatsApp
// Handle button/list reply callbacks from WhatsApp AND Messenger
function parseInteractiveReply(message) {
  // WhatsApp Button
  if (message.interactive?.type === 'button_reply') {
    return {
      type: 'button',
      id: message.interactive.button_reply.id,
      title: message.interactive.button_reply.title
    };
  }
  // WhatsApp List
  if (message.interactive?.type === 'list_reply') {
    return {
      type: 'list',
      id: message.interactive.list_reply.id,
      title: message.interactive.list_reply.title
    };
  }

  // Messenger Postback
  if (message.interactive?.type === 'postback') {
    return {
      type: 'button', // Treat as button
      id: message.interactive.payload,
      title: message.interactive.title
    };
  }

  // Messenger Quick Reply
  if (message.interactive?.type === 'quick_reply') {
    return {
      type: 'button', // Treat as button
      id: message.interactive.payload,
      title: message.interactive.payload // Title often same as payload if no separate title
    };
  }

  return null;
}

async function routeIntent({ text, context, userId, interactiveReply, location }) {
  console.log(`━━━ ROUTING MESSAGE ━━━`);
  console.log(`📍 Context stage: ${context.stage || 'initial'}`);

  // Handle interactive replies (button clicks, list selections)
  if (interactiveReply) {
    const { id, title } = interactiveReply;
    console.log(`🔘 Interactive reply: ${id} - ${title}`);

    // Category selection from menu
    if (id.startsWith('cat_')) {
      const category = id.replace('cat_', '');
      return await toolHandlers.show_category_items({ category }, userId, context);
    }

    // Add item to cart (id format: add_<foodId>)
    if (id.startsWith('add_')) {
      const foodId = parseInt(id.replace('add_', ''));
      if (!isNaN(foodId)) {
        return await toolHandlers.add_to_cart({ foodId }, userId, context);
      }
    }

    // Handle Get Started (Welcome)
    if (id === 'GET_STARTED') {
      return await toolHandlers.show_welcome_message({}, userId, context);
    }

    // User wants to add more items
    if (id === 'add_more_items') {
      return await toolHandlers.show_food_menu({}, userId, context);
    }

    // Quick add more from same category (new flow)
    if (id.startsWith('more_')) {
      const category = id.replace('more_', '');
      return await toolHandlers.show_category_items({ category }, userId, context);
    }

    // View all categories (new flow)
    if (id === 'view_all_categories') {
      return await toolHandlers.show_food_menu({}, userId, context);
    }

    // Service type selection
    if (id === 'service_dine_in') {
      return await toolHandlers.select_service_type({ type: 'dine_in' }, userId, context);
    }
    if (id === 'service_delivery') {
      return await toolHandlers.select_service_type({ type: 'delivery' }, userId, context);
    }

    // Location Method Selection
    if (id === 'req_loc_share') return await toolHandlers.handle_location_method({ method: 'share' }, userId, context);
    if (id === 'req_loc_type') return await toolHandlers.handle_location_method({ method: 'type' }, userId, context);

    // User wants to checkout
    if (id === 'proceed_checkout') {
      return await toolHandlers.confirm_order({ items: context.cart }, userId, context);
    }

    // Order confirmation/cancellation
    if (id === 'confirm_order') {
      return await toolHandlers.process_order_response({ action: 'confirmed' }, userId, context);
    }
    if (id === 'cancel_order') {
      return await toolHandlers.process_order_response({ action: 'cancelled' }, userId, context);
    }

    // Cancel confirmation flow
    if (id === 'confirm_cancel') {
      return await toolHandlers.process_order_response({ action: 'cancel_confirm' }, userId, context);
    }
    if (id === 'back_to_cart') {
      return await toolHandlers.show_cart_options({}, userId, context);
    }

    // Payment method selection
    if (id === 'pay_online') {
      return await toolHandlers.process_payment({ method: 'ONLINE' }, userId, context);
    }
    // Handle Cash on Delivery payment
    if (id === 'pay_cod') {
      return await toolHandlers.process_payment({ method: 'CASH' }, userId, context);
    }
    // Handle dine-in cash payment
    if (id === 'pay_cash_counter') {
      return await toolHandlers.pay_cash_counter({}, userId, context);
    }

    // Reservation Flow
    if (id === 'confirm_deposit') {
      // After deposit confirmation, show payment options
      return await toolHandlers.show_dine_in_payment_options({}, userId, context);
    }
  }

  // Handle Text Inputs based on Stage
  if (!interactiveReply && text) {
    if (context.stage === 'collecting_party_size') {
      const size = parseInt(text);
      if (!isNaN(size) && size > 0) {
        return await toolHandlers.collect_arrival_time({ partySize: size }, userId, context);
      } else {
        await sendMessage(userId, context.platform, "Please enter a valid number for party size.");
        return { reply: null, updatedContext: context };
      }
    }

    if (context.stage === 'collecting_arrival_time') {
      return await toolHandlers.confirm_reservation_deposit({ arrivalTime: text }, userId, context);
    }

    if (context.stage === 'providing_location') {
      // Pass both text address and location object (if shared via WhatsApp location)
      return await toolHandlers.provide_location({
        address: text,
        location: location || null
      }, userId, context);
    }

    // Handle payment method selection via text
    if (context.stage === 'selecting_payment') {
      const paymentText = text.toLowerCase();
      if (paymentText.includes('online') || paymentText.includes('online payment') || paymentText.includes('esewa') || paymentText.includes('khalti')) {
        return await toolHandlers.process_payment({ method: 'ONLINE' }, userId, context);
      } else if (paymentText.includes('cash') || paymentText.includes('cod') || paymentText.includes('cash on delivery')) {
        return await toolHandlers.process_payment({ method: 'CASH' }, userId, context);
      } else {
        await sendMessage(userId, context.platform, "Please choose: 'Online Payment' or 'Cash on Delivery'");
        return { reply: null, updatedContext: context };
      }
    }
  }

  // Check for order history keywords
  const lowerText = text?.toLowerCase() || '';
  if (lowerText.includes('order history') || lowerText.includes('my orders') || lowerText.includes('past orders') || lowerText.includes('previous orders')) {
    return await toolHandlers.show_order_history({}, userId, context);
  }

  // Use LLM to detect intent and decide which tool to call
  console.log(`🤖 Asking LLM for intent...`);
  const decision = await detectIntentAndRespond(text, context);

  console.log(`━━━ LLM DECISION ━━━`);
  console.log(`🎯 Intent: ${decision.intent}`);
  console.log(`🔧 Tool: ${decision.toolCall?.name || 'none'}`);
  console.log(`📝 Args: ${JSON.stringify(decision.toolCall?.arguments || {})}`);

  if (decision.toolCall && toolHandlers[decision.toolCall.name]) {
    // 🛡️ VALIDATION LAYER
    const { isValid, message: validationMsg } = validateToolCall(
      decision.toolCall.name,
      decision.toolCall.arguments
    );

    if (!isValid) {
      console.warn(`Validation failed for ${decision.toolCall.name}: ${validationMsg}`);
      await sendMessage(userId, context.platform, validationMsg);
      return { reply: null, updatedContext: context }; // Stop execution
    }

    return await toolHandlers[decision.toolCall.name](
      decision.toolCall.arguments,
      userId,
      context
    );
  }



  // Fallback
  const fallbackMessage = decision.response || "Hello! Welcome to our restaurant 🍽️ Type 'menu' to see our delicious options!";
  await sendMessage(userId, context.platform, fallbackMessage);
  return {
    reply: null,
    updatedContext: context
  };
}

export { routeIntent, parseInteractiveReply };
