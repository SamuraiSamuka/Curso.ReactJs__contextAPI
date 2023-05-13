import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({children}) => {
    const [carrinho, setCarrinho] = useState([])
    const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
    return (
        <CarrinhoContext.Provider value={{ carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () => {
    const {
        carrinho, 
        setCarrinho, 
        quantidadeProdutos, 
        setQuantidadeProdutos} = useContext(CarrinhoContext);
    
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

    useEffect(() => {
        const novaQuantidade = carrinho.reduce((contador, itemNoCarrinho) => contador + itemNoCarrinho.quantidade, 0);
        setQuantidadeProdutos(novaQuantidade)
    }, [carrinho, setQuantidadeProdutos])

    return {
        carrinho, 
        setCarrinho, 
        adicionarProduto, 
        removerProduto, 
        quantidadeProdutos,
        setQuantidadeProdutos
    }
}