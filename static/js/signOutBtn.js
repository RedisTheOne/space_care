document.getElementById('signOutBtn').addEventListener('click', () => {
    localStorage.removeItem('USERNAME');
    window.location.href = '/signin';
});