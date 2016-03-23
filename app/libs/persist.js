import makeFinalStore from 'alt-utils/lib/makeFinalStore'

export default function(alt, storage, storeName) {
    const finalStore = makeFinalStore(alt)

    try {
        alt.bootstrap(storage.get(storeName))
    } catch (e) {
        console.error('Failed to bootstrap', e);
    }

    finalStore.listen(() => {
        storage.set(storeName, alt.takeSnapshot())
    })
}
