export interface CobranzaCalcI
{
    element: string;
    element_label: string;
    value: number;
    quantity: number;
    quantity_type: 'dias' | '%' | ''  | 'horas';
    number_sign: 'positive' | 'negative';
    amount: number;
    currency: string;
}
