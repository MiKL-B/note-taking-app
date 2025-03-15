export function openModal() {
    return new Promise((resolve, reject) => {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
        document.getElementById('confirm').onclick = function () {
            modal.style.display = 'none';
            resolve(true); // L'utilisateur a confirmé
        };

        document.getElementById('cancel').onclick = function () {
            modal.style.display = 'none';
            resolve(false); // L'utilisateur a annulé
        };
    });
}