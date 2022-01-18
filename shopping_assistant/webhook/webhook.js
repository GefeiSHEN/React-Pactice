const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();
const fetch = require("node-fetch");
const base64 = require("base-64");

let username = "";
let password = "";
let token = "";
let tags = "";

USE_LOCAL_ENDPOINT = false;
// set this flag to true if you want to use a local endpoint
// set this flag to false if you want to use the online endpoint
ENDPOINT_URL = "";
if (USE_LOCAL_ENDPOINT) {
  ENDPOINT_URL = "http://127.0.0.1:5000";
} else {
  ENDPOINT_URL = "http://cs571.cs.wisc.edu:5000";
}

async function addMessage(message, isUser) {
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      date: new Date(),
      isUser: isUser,
      text: message,
      id: 32,
    })
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/application/messages", request);
  const serverResponse = await serverReturn.json();
}

async function clearMessage() {
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/application/messages", request);
  const serverResponse = await serverReturn.json();
}

async function getToken() {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + base64.encode(username + ":" + password),
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/login", request);
  const serverResponse = await serverReturn.json();
  token = serverResponse.token;

  return token;
}

async function getTags(category) {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/categories/" + category + "/tags", request);
  const serverResponse = await serverReturn.json();
  tags = serverResponse.tags;
  return tags;
}

async function getCart() {
  if (token !== "" && typeof token !== 'undefined') {
    let request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "x-access-token": token,
      },
    };

    const serverReturn = await fetch(ENDPOINT_URL + "/application/products", request);
    const serverResponse = await serverReturn.json();
    let products = serverResponse.products;

    if (products.length == 0) {
      return "nothing";
    }
    return cartToString(products);
  } else {
    return "no-token";
  }
}

function cartToString(products) {
  let count = 0;
  let price = 0.0;
  var items = new Array(100);
  let result = "You have: ";
  for (var i = 0; i < 100; i++) {
    items[i] = new Array(2);
  }
  for (let i = 0; i < products.length; i++) {
    count+=products[i].count;
    price += products[i].price*products[i].count;
    result = result + products[i].count + " " + products[i].name + " ";
  }
  return result + "in your cart, thats " + count + " items with a total of $" + price + ".";
}

async function getProducts() {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "x-access-token": token,
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/products", request);
  const serverResponse = await serverReturn.json();
  let products = serverResponse.products;

  return products;
}

async function getProductDetail(id) {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "x-access-token": token,
    },
  };
  const serverReturn = await fetch(ENDPOINT_URL + "/products/" + id + "/", request);
  const serverResponse = await serverReturn.json();
  let response = serverResponse.name + " is $" + serverResponse.price + ". " + serverResponse.description + " ";
  let request2 = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "x-access-token": token,
    },
  };

  const serverReturn2 = await fetch(ENDPOINT_URL + "/products/" + id + "/reviews/", request2);
  const serverResponse2 = await serverReturn2.json();
  let reviews = serverResponse2.reviews;
  if (reviews.length != 0) {
    let rating = 0.0;
    let bestindex = 0;
    let highestStar = 0;
    for (let i = 0; i < reviews.length; i++) {
      rating += reviews[i].stars;
      if (reviews[i].stars > highestStar) {
        bestindex = i;
      }
    }
    rating = rating / reviews.length;
    response += "It has a average rating of " + rating + ", customer saids: " + reviews[highestStar].text + ".";
  } else {
    response += " It does not have reviews or ratings."
  }

  return response;
}

async function getLocation() {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "x-access-token": token,
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/application", request);
  const serverResponse = await serverReturn.json();
  let location = serverResponse.page;
  return location;
}

async function filter(tag) {
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'x-access-token': token,
    }
  };
  const serverReturn = await fetch(ENDPOINT_URL + "/application/tags/" + tag, request);
  const serverResponse = await serverReturn.text();
}

async function addToCart(id) {
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "x-access-token": token,
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/application/products/" + id, request);
  const serverResponse = await serverReturn.json();
}

async function removeFromCart(id) {
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "x-access-token": token,
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/application/products/" + id, request);
  const serverResponse = await serverReturn.json();
}

async function clearCart() {
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "x-access-token": token,
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/application/products/", request);
  const serverResponse = await serverReturn.json();
}

async function navigate(page) {
  // Navigate the user to the page of that category.
  let request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'x-access-token': token,
    },
    body: JSON.stringify({
      dialogflowUpdated: true,
      back: false,
      page: page,
    })
  };
  console.log("Navigate to " + page);
  const serverReturn = await fetch(ENDPOINT_URL + "/application", request);
  const serverResponse = await serverReturn.text();
  console.log(serverResponse);
}

async function navigate_back() {
  // Navigate the user to the page of that category.
  let request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'x-access-token': token,
    },
    body: JSON.stringify({
      dialogflowUpdated: true,
      back: true,
    })
  };
  const serverReturn = await fetch(ENDPOINT_URL + "/application", request);
  const serverResponse = await serverReturn.text();
  console.log(serverResponse);
}

app.get("/", (req, res) => res.send("online"));
app.post("/", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function welcome() {
    agent.add("Webhook works!");
    console.log(ENDPOINT_URL);
  }

  async function login() {
    // You need to set this from `username` entity that you declare in DialogFlow
    username = agent.parameters.Username;
    // You need to set this from password entity that you declare in DialogFlow
    password = agent.parameters.Password;
    await getToken();
    if (token !== "" && typeof token !== 'undefined') {
      let response = "Welcome " + username + "! What can I do for you today?";
      agent.add(response);
      await clearMessage();
      await addMessage(response, false);
    }
  }

  async function query_category() {
    await addMessage(agent.query, true);
    agent.add("Six categories! Bottoms, hats, leggings, plushes, sweatshirts and tees :  )");
    await addMessage("Six categories! Bottoms, hats, leggings, plushes, sweatshirts and tees :  )", false);
  }

  async function query_tags() {
    await addMessage(agent.query, true);
    let category = agent.parameters.Category;

    if (category !== "" && typeof category !== 'undefined') {
      await getTags(category);
      if (tags !== "" && typeof tags !== 'undefined') {
        let response = "These are the avaliable tags for " + category + " : " + tags.join(", ") + ". Anything insterested?"
        agent.add(response);
        await addMessage(response, false);
      }
    } else {
      let response = "What category are you interested in?";
      agent.add(response);
      await addMessage(response, false);
    }
  }

  async function query_cart() {
    await addMessage(agent.query, true);
    let result = await getCart();
    if (result == 'no-token') {
      agent.add("Please login first");
      await addMessage("Please login first", false);
    } else if (result === "nothing") {
      agent.add("Looks like you don't have anything in the shopping cart. Start shopping?");
      await addMessage("Looks like you don't have anything in the shopping cart. Start shopping?", false);
    } else {
      agent.add(result);
      await addMessage(result, false);
    }
  }

  async function query_info() {
    await addMessage(agent.query, true);
    let products = await getProducts();
    let product = agent.parameters.Product.toLowerCase();
    let isFound = false;
    for (let i = 0; i < products.length; i++) {
      if (product === products[i].name.toLowerCase()) {
        isFound = true;
        let response = await getProductDetail(products[i].id);
        agent.add(response);
        await addMessage(response, false);
      }
    }
    if (!isFound) {
      agent.add("I can't find the product with that name, could you please try again?");
      await addMessage("I can't find the product with that name, could you please try again?", false);
    }
  }

  async function action_tag() {
    await addMessage(agent.query, true);
    let searchTag = agent.parameters.searchTag.toLowerCase();

    category = await getLocation();
    await filter(searchTag);

    agent.add("There you go, here are the ones I found");
    await addMessage("There you go, here are the ones I found", false);
  }

  async function action_add() {
    await addMessage(agent.query, true);
    let productName = agent.parameters.productName.toLowerCase();
    let quantity = agent.parameters.quantity;
    if (quantity == 0) {
      agent.add("That's a smart choice! How many do you want?");
      await addMessage("That's a smart choice! How many do you want?", false);
    } else if (quantity < 0) {
      agent.add("You can't add air to your cart right?");
      await addMessage("You can't add air to your cart right?", false);
    } else {
      let products = await getProducts();
      let isFound = false;
      for (let i = 0; i < products.length; i++) {
        if (productName === products[i].name.toLowerCase()) {
          isFound = true;
          for (let j = 0; j < quantity; j++) {
            await addToCart(products[i].id);
          }
          agent.add("It's added~ Anything else?");
          await addMessage("It's added~ Anything else?", false);
        }
      }
      if (!isFound) {
        agent.add("I can't find the product with that name, could you please try again?");
        await addMessage("I can't find the product with that name, could you please try again?", false);
      }
    }
  }

  async function action_remove() {
    await addMessage(agent.query, true);
    let productName = agent.parameters.productName.toLowerCase();
    let quantity = agent.parameters.quantity;
    if (quantity == 0) {
      agent.add("Sure, how many do you want me remove?");
      await addMessage("Sure, how many do you want me remove?", false);
    } else if (quantity < 0) {
      agent.add("Quantity can't be negative right?");
      await addMessage("Quantity can't be negative right?", false);
    } else {
      let products = await getProducts();
      let isFound = false;
      for (let i = 0; i < products.length; i++) {
        if (productName === products[i].name.toLowerCase()) {
          isFound = true;
          for (let j = 0; j < quantity; j++) {
            await removeFromCart(products[i].id);
          }
          agent.add("It's removed~ Anything else?");
          await addMessage("It's removed~ Anything else?", false);
        }
      }
      if (!isFound) {
        agent.add("I can't find the product with that name, could you please try again?");
        await addMessage("I can't find the product with that name, could you please try again?", false);
      }
    }
  }

  async function action_clearCart() {
    await addMessage(agent.query, true);
    let confirm = agent.parameters.confirmed;
    if (confirm === "" || typeof confirm === 'undefined') {
      agent.add("OK Are you sure you want to clear your cart? This cannot be undo!");
      await addMessage("OK Are you sure you want to clear your cart? This cannot be undo!", false);
    } else if (confirm === "true") {
      clearCart();
      agent.add("Sure, your cart has been cleared");
      await addMessage("Sure, your cart has been cleared", false);
    } else {
      agent.add("Alright, I didn't touch your cart.");
      await addMessage("Alright, I didn't touch your cart.", false);
    }
  }

  async function action_checkout() {
    await addMessage(agent.query, true);
    let confirm = agent.parameters.confirmCheckout;

    if (confirm === "" || typeof confirm === 'undefined') {
      await navigate("/" + username + "/cart-review");
      agent.add("Here is your shopping cart, does everything looks good?");
      await addMessage("Here is your shopping cart, does everything looks good?", false);
    } else if (confirm === "true") {
      await navigate("/" + username + "/cart-confirmed");
      agent.add("Order placed~ Wish you enjoy it~");
      await addMessage("Order placed~ Wish you enjoy it~", false);
    } else {
      await navigate("/" + username + "/");
      agent.add("Definitely, I won't place the order for you.");
      await addMessage("Definitely, I won't place the order for you.", false);
    }
  }

  async function navigation() {
    await addMessage(agent.query, true);
    let dest = agent.parameters.navigation;
    await navigate("/"+username+"/"+dest);
    agent.add("There you go, here is the "+dest+" page.");
    await addMessage("There you go, here is the "+dest+" page.", false);
  }

  async function back() {
    await addMessage(agent.query, true);
      await navigate_back();
      agent.add("Here's the most recent page.");
      await addMessage("Here's the most recent page.", false);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  // You will need to declare this `Login` intent in DialogFlow to make this work
  intentMap.set("Login", login);
  intentMap.set("query-category", query_category);
  intentMap.set("query-tags", query_tags);
  intentMap.set("query-cart", query_cart);
  intentMap.set("query-info", query_info);
  intentMap.set("action-tag", action_tag);
  intentMap.set("action-add", action_add);
  intentMap.set("action-remove", action_remove);
  intentMap.set("action-clearCart", action_clearCart);
  intentMap.set("action-checkout", action_checkout);
  intentMap.set("navigate", navigation);
  intentMap.set("back", back);
  agent.handleRequest(intentMap);
});

app.listen(process.env.PORT || 8080);
