/**
 * Calculates the total price for a custom bouquet
 * @param {Object} options - Customization options
 * @param {number} options.flowerPrice - Price of selected flower type per dozen
 * @param {number} options.dozens - Number of dozens
 * @param {number} options.fillersPrice - Price of additional fillers
 * @returns {number} The calculated price
 */
export const calculatePrice = ({ flowerPrice = 0, dozens = 1, fillersPrice = 0 }) => {
    // Ribbon, Wrapper and Message are included in base price
    // The core formula: (Base Flower Price * Dozens) + Fillers
    return (flowerPrice * dozens) + fillersPrice
}
g