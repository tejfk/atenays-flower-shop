import { useState, useEffect } from 'react'
import { db } from '../firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

export default function useBuilderOptions() {
    const [options, setOptions] = useState({
        flowers: [{ name: 'Roses' }, { name: 'Sunflowers' }, { name: 'Tulips' }, { name: 'Peonies' }],
        wrappers: [
            { name: 'Blush Pink', hex: '#F5A5A5' },
            { name: 'Ivory White', hex: '#FFF8F0' },
            { name: 'Sage Green', hex: '#B5C9B5' },
            { name: 'Matte Black', hex: '#333333' }
        ],
        ribbons: [
            { name: 'Blush Pink', hex: '#F5A5A5' },
            { name: 'Ivory White', hex: '#FFF8F0' },
            { name: 'Sage Green', hex: '#B5C9B5' },
            { name: 'Matte Black', hex: '#333333' }
        ],
        fillers: [{ name: 'Baby\'s Breath' }, { name: 'Eucalyptus' }, { name: 'Caspia' }]
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOptions = async () => {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), 5000)
            );

            try {
                const docSnap = await Promise.race([
                    getDoc(doc(db, 'settings', 'customization')),
                    timeoutPromise
                ]);

                if (docSnap && docSnap.exists()) {
                    const data = docSnap.data()

                    setOptions(prev => ({
                        flowers: data.flowers?.length > 0 ? data.flowers : prev.flowers,
                        wrappers: data.wrappers?.length > 0 ? data.wrappers : prev.wrappers,
                        ribbons: data.ribbons?.length > 0 ? data.ribbons : prev.ribbons,
                        fillers: data.fillers?.length > 0 ? data.fillers : prev.fillers
                    }))
                }
            } catch (error) {
                console.error("Error or timeout fetching customization options:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOptions()
    }, [])

    return { options, loading }
}
