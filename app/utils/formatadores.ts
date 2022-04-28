export const formatarMoeda = (valor: number): string =>
    valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        style: 'currency',
        currency: 'BRL',
    })