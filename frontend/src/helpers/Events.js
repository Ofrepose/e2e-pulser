export function handleKeyPress(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        console.log('Ctrl + Shift + S pressed');
      }
}