if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }

  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    // Update UI to notify the user they can install the PWA
    document.getElementById('installButton').style.display = 'block';
  });

  document.getElementById('installButton').addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });

// Check if the browser supports service workers and the beforeinstallprompt event.
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt.
  event.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = event;
  // Update UI notify the user they can add to home screen
  showInstallPromotion();
});

function showInstallPromotion() {
  // Display your install banner here (e.g., show a button "Add to Home Screen")
  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block';
  installButton.addEventListener('click', () => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
}
