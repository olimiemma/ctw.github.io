// Instantiate App object, passing in Vue constructor option...
const app = new Vue({
  el: '#app',
  data() {
    return {
      messageHistory: [], // store messages for rendering chat logs
    }
  },
  mounted() {
    // Function called once component has been initialized and rendered.
    document.getElementById('chatForm').addEventListener('submit', e => {
      e.preventDefault(); // Prevent default browser behavior.
      const formData = new FormData(e.target);
      
      // Send AJAX post request to server endpoint /getScriptures
      fetch('/getScriptures', {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json()) // Convert response to json format
          .then((data) => {
            console.log(`Received scriptures: ${JSON.stringify(data)}`);
            
            // Log retrieved scriptures to sessionStorage (if supported)
            // This is now more secure, using sessionStorage instead of localStorage
            window.sessionStorage.setItem('messages', JSON.stringify([].concat(messageHistory, [data])));
            
            // Generate chat log div dynamically as per returned data length
            renderChatLog(data);
          });
    });
  },
  methods: {
    // This method generates the chat log div
    renderChatLog(data) {
      const scriptContent = data.map((verse) => `
        <span>
          <button onclick="delMessage(${verse.verse_id})">X</button>
          <p class="verses">${verse.verse}</p>
        </span>
      `).join('');
      
      // Append the chat log div to the DOM
      document.getElementById('chatLog').innerHTML = scriptContent;
    }
  }
});
