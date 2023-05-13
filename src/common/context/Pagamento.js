import { useState, createContext, useContext } from "react";

export const PagamentoContext = createContext();
PagamentoContext.displayName = "Pagamento";

export const PagamentoProvider = ({children}) => {
    const tiposPagamento = [{
        nome: "boleto",
        juros: 1,
        id: 1
    }, {
        nome: "cartão de crédito",
        juros: 1.1,
        id: 2
    }, {
        nome: "pix",
        juros: 1,
        id: 3
    }, {
        nome: "crediário",
        juros: 1.25,
        id: 4
    }]

    const [formaPagamento, setFormaPagamento] = useState(tiposPagamento[0]);
    
    return (
        <PagamentoContext.Provider value={{
            tiposPagamento,
            formaPagamento,
            setFormaPagamento
        }}>
            {children}
        </PagamentoContext.Provider>
    )
}

export const usePagamentoContext = () => {
    const {
        formaPagamento, 
        setFormaPagamento, 
        tiposPagamento} = useContext(PagamentoContext);

        console.log(formaPagamento.id)
    function mudarFormaPagamento(id) {
        const pagamentoAtual = tiposPagamento.find(pagamento => pagamento.id === id)

        setFormaPagamento(pagamentoAtual);
    }

    return {
        tiposPagamento,
        formaPagamento,
        mudarFormaPagamento
    }
}