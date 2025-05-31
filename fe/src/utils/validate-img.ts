export const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    return validTypes.includes(file.type);
};  