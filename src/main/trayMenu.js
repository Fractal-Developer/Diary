export const trayMenu = (win) => [
    {
        label: 'Свернуть/Развернуть',
        click: () => {
            win.isVisible() ? win.hide() : win.show()
        }
    },
    {
        role: 'quit'
    }
];