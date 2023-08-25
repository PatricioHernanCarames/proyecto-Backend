const socket = io(); // Connect to the Socket.IO server

  
  socket.on("allProducts", (products) => {
    const productListDiv = document.getElementById("productList");

    
    products.forEach(product => {
      const productItem = document.createElement("div");
      productItem.textContent = product.title; // Display the product title
      productListDiv.appendChild(productItem);
    });
  });
