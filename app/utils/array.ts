export function normalizarParaArray<T>(valor: T | T[]): T[] {
    return Array.isArray(valor) ? valor : [valor]
}
