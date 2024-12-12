from app import carregar_dados_embutidos, buscar_palavra_chave  # Importar as funções do app.py

# Carregar os dados embutidos do arquivo JSON
dados = carregar_dados_embutidos()

# Função para testar a busca
def testar_busca():
    palavra_chave = input("Digite a palavra-chave para buscar: ").strip()
    resultados = buscar_palavra_chave(dados, palavra_chave)
    
    if not resultados:
        print("Nenhum resultado encontrado.")
    else:
        for item in resultados:
            grupo = item.get("GRUPO", "N/A")
            subgrupo = item.get("SUBGRUPO", "N/A")
            servico = item.get("OBRA/SERVIÇO", "N/A")
            complemento = item.get("COMPLEMENTO", "N/A")
            print(f"{grupo.upper()} > {subgrupo.upper()} > {servico.upper()} > {complemento.upper()}")

# Chama a função de teste
if __name__ == "__main__":
    testar_busca()
