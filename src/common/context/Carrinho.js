import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({children}) => {
    const [carrinho, setCarrinho] = useState([])
    const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
    const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);
    return (
        <CarrinhoContext.Provider value={{ carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos, valorTotalCarrinho, setValorTotalCarrinho }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () => {
    const {
        carrinho, 
        setCarrinho, 
        quantidadeProdutos, 
        setQuantidadeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho} = useContext(CarrinhoContext);
    const {
        formaPagamento
    } = usePagamentoContext();
    const { setSaldo } = useContext(UsuarioContext);
    
    function mudarQuantidade(id, op) {
        return carrinho.map((itemDoCarrinho) => {
                if(itemDoCarrinho.id === id) {
                    if (op === '+') itemDoCarrinho.quantidade += 1
                    else if (op === '-') itemDoCarrinho.quantidade -= 1
                }
                
                return itemDoCarrinho 
            })
    }

    function adicionarProduto(novoProduto) {
        const temOproduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id)
        if(!temOproduto) {
        novoProduto.quantidade = 1;
        return setCarrinho(carrinhoAnterior => [...carrinhoAnterior, novoProduto]);
        }
        setCarrinho(mudarQuantidade(novoProduto.id, '+'))
    }

    function removerProduto(id) {
        const produto = carrinho.find(itemDoCarrinho => itemDoCarrinho.id === id);
        
        if(produto) {
            const ehOUltimo = produto.quantidade === 1
            
            if(ehOUltimo) {
                setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemDoCarrinho => itemDoCarrinho.id !== id))
            } else {
                setCarrinho(mudarQuantidade(id, '-'))
            }
        }
    }

    function efetuarCompra() {
        setCarrinho([]);
        setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho)
    }

    useEffect(() => {
        const { novoTotal, novaQuantidade} = carrinho.reduce((contador, itemNoCarrinho) => ({
            novaQuantidade: contador.novaQuantidade + itemNoCarrinho.quantidade,
            novoTotal: contador.novoTotal + (itemNoCarrinho.quantidade * itemNoCarrinho.valor)
        }), { novaQuantidade: 0, novoTotal: 0 });

        setQuantidadeProdutos(novaQuantidade)
        setValorTotalCarrinho(novoTotal * formaPagamento.juros)
    }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento])

    return {
        carrinho, 
        setCarrinho, 
        adicionarProduto, 
        removerProduto, 
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        efetuarCompra
    }
}