from flask import Flask, render_template, jsonify, send_from_directory
import os
import json
from unidecode import unidecode  # Para remover acentos e normalizar as palavras

# Inicializa o Flask
app = Flask(__name__, static_folder="../frontend/static", template_folder="templates")

# Função para carregar os dados do arquivo JSON
def carregar_dados_embutidos(caminho_arquivo):
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
            return json.load(arquivo)
    except (FileNotFoundError, json.JSONDecodeError) as erro:
        print(f"Erro ao carregar os dados: {erro}")
        return []

# Função de busca
def buscar_palavra_chave(dados, palavra_chave):
    palavra_chave_normalizada = unidecode(palavra_chave.lower())  # Normaliza e remove acentos
    resultados = []

    grupo_anterior, subgrupo_anterior, obra_servico_anterior = "", "", ""

    for item in dados:
        grupo = unidecode(str(item.get("GRUPO", ""))).lower()
        subgrupo = unidecode(str(item.get("SUBGRUPO", ""))).lower()
        obra_servico = unidecode(str(item.get("OBRA/SERVIÇO", ""))).lower()
        complemento = unidecode(str(item.get("COMPLEMENTO", ""))).lower()

        if any(palavra_chave_normalizada in campo for campo in [grupo, subgrupo, obra_servico, complemento]):
            grupo_exibir = grupo.capitalize() if grupo != grupo_anterior else ""
            subgrupo_exibir = subgrupo.capitalize() if subgrupo != subgrupo_anterior else ""
            obra_servico_exibir = obra_servico.capitalize() if obra_servico != obra_servico_anterior else ""

            resultados.append({
                "GRUPO": grupo_exibir,
                "SUBGRUPO": subgrupo_exibir,
                "OBRA/SERVIÇO": obra_servico_exibir,
                "COMPLEMENTO": complemento.capitalize()
            })

            grupo_anterior, subgrupo_anterior, obra_servico_anterior = grupo, subgrupo, obra_servico

    return resultados

# Rota para a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para buscar palavra-chave
@app.route('/buscar/<string:palavra_chave>', methods=['GET'])
def buscar(palavra_chave):
    caminho_dados = os.path.join(os.path.dirname(__file__), "tabelaart.json")
    dados = carregar_dados_embutidos(caminho_dados)
    
    if not dados:
        return jsonify({"mensagem": "Erro ao carregar os dados"}), 500

    resultados = buscar_palavra_chave(dados, palavra_chave)

    if resultados:
        return jsonify(resultados)
    return jsonify({"mensagem": "Nenhum resultado encontrado"}), 404

# Rota para retornar o arquivo JSON
@app.route('/static/padrao_edificacao.json')
def serve_json():
    try:
        return send_from_directory(os.path.join(os.path.dirname(__file__)), 'padrao_edificacao.json')
    except FileNotFoundError:
        return jsonify({"mensagem": "Arquivo JSON não encontrado"}), 404

# Inicializa a aplicação
if __name__ == '__main__':
    app.run(debug=True)
