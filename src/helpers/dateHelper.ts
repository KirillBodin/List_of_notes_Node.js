export const getDates = (text: string): string => {
    const dateRegex = /([1-9]|[12]\d|3[01])\/([1-9]|1[0-2])\/[12]\d{3}/g;
    const dates = text?.match(dateRegex) || [];
    return dates.join(', ');
};

export const getNewDate = (): string => {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {month: 'long', day: '2-digit'};
    const formattedDate = currentDate.toLocaleString('en', options);
    return `${formattedDate}, ${currentDate.getFullYear()}`;
};
