export function displayDate(dateString: string) {
    return new Date(dateString).toISOString().replace("-", "/").split("T")[0].replace("-", "/");;
}