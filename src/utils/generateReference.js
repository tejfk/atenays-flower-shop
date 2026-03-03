/**
 * Generates a unique reference number: ATN-YYMMDD-XXXX
 * @returns {string} The generated reference number
 */
export const generateReference = () => {
    const date = new Date()
    const year = String(date.getFullYear()).slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    // Generate random 4-character alphanumeric string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomPart = ''
    for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return `ATN-${year}${month}${day}-${randomPart}`
}
