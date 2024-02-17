self.addEventListener("message", (event) => {
    const message = event.data;
    console.log('Service Worker received message:', message);
  
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage(message);
      });
    });
  });

