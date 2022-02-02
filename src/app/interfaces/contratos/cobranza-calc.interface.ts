export interface CobranzaI
{
    element: string;
    element_label: string;
    value: number;
    quantity: number;
    quantity_type: 'dias' | '%' | '';
    number_sign: 'positive' | 'negative';
    amount: number;
    currency: string;
}
