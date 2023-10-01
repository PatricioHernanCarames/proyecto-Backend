const socket = io(); 

  
  socket.on("allProducts", (products) => {
    const productListDiv = document.getElementById("productList");

    
    products.forEach(product => {
      const productItem = document.createElement("div");
      productItem.textContent = product.title; 
      productListDiv.appendChild(productItem);
    });
  });
  

  let userName;
  
  Swal.fire({
      title: 'identificate',
      input: 'text',
      text: 'ingresa tu nombre de usuario',
      inputValidator: (value)=>{
          return  !value && "es obligatorio introducir un nombre de usuario";
      },
      allowOutsideClick: false,
    }).then((result)=>{
      console.log(result);
      userName=result.value;
      socket.emit("new-user",userName);
    })
  
    const chatInput=document.getElementById("chat-input");
  
    chatInput.addEventListener("keyup", (ev)=>{
      
      if (ev.key === "enter"){
      const input = chatInput.value;
          if(inputMessage.trim().length>0){
              socket.emit("chat", {message: inputMessage, userName: userName});
  
              chatInput.value="";
          }
      
      }
    })
  
    const messages= document.getElementById("messages");
    socket.on("messages", (data)=>{
      let messages="";
  
      data.array.forEach((m) => {
          messages+=`<b class="message">${m.userName}</b>${m.message}</br>`;
          
      });
      messagesPannel.innerHtml= messages;
    })
  
    socket.on("new-user",(userName)=>{
      swal.fire({
          title: `${username} se ha unido al chat`,
          toast: true,
          position: "top-end",
  
      })
    })
    