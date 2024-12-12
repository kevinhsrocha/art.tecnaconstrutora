document.addEventListener('DOMContentLoaded', function() {
    const pesquisaInput = document.getElementById('pesquisa');
    const tabelaResultados = document.querySelector('#tabela-resultados tbody');
    const servicosPadrao = document.getElementById('menu-servicos-padrao');
    const submenuServicos = document.getElementById('submenu-servicos');

    // Ocultar subpasta por padrão
    submenuServicos.style.display = 'none';

    // Alternar exibição do submenu ao clicar na pasta principal
    servicosPadrao.addEventListener('click', function() {
        submenuServicos.style.display = submenuServicos.style.display === 'none' ? 'block' : 'none';
    });

    // Evento para carregar dados da subpasta "Nova edificação comercial/residencial"
    document.getElementById('subpasta-edificacao').addEventListener('click', function() {
        fetch('/static/padrao_edificacao.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da requisição');
                }
                return response.json();
            })
            .then(data => {
                // Limpa a tabela antes de adicionar novos resultados
                tabelaResultados.innerHTML = '';

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item["GRUPO"] || '-'}</td>
                            <td>${item["SUBGRUPO"] || '-'}</td>
                            <td>${item["OBRA/SERVIÇO"] || '-'}</td>
                            <td>${formatarComplemento(item["COMPLEMENTO"])}</td>
                        `;
                        tabelaResultados.appendChild(row);
                    });
                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = "<td colspan='4'>Nenhum resultado encontrado</td>";
                    tabelaResultados.appendChild(row);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar dados da subpasta:', error);
                tabelaResultados.innerHTML = '';
                const row = document.createElement('tr');
                row.innerHTML = "<td colspan='4'>Erro ao carregar dados</td>";
                tabelaResultados.appendChild(row);
            });
    });

    // Função para formatar o complemento e substituir "Nan" por "N/A"
    function formatarComplemento(complemento) {
        // Substituir "Nan" por "N/A"
        if (complemento === "Nan") {
            return "N/A";
        }
        return complemento || '-'; // Se o valor estiver vazio ou undefined, retorna "-"
    }

    // Função para criar elementos de linha da tabela
    function criarLinhaTabela(item) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item["GRUPO"] || '-'}</td>
            <td>${item["SUBGRUPO"] || '-'}</td>
            <td>${item["OBRA/SERVIÇO"] || '-'}</td>
            <td>${formatarComplemento(item["COMPLEMENTO"])}</td>
        `;
        return row;
    }

    // Função para mostrar mensagem de nenhum resultado encontrado
    function exibirMensagemNenhumResultado() {
        const row = document.createElement('tr');
        row.innerHTML = "<td colspan='4'>Nenhum resultado encontrado</td>";
        tabelaResultados.appendChild(row);
    }

    // Evento de digitação no campo de pesquisa
    pesquisaInput.addEventListener('input', function() {
        const palavraChave = pesquisaInput.value.trim();

        if (palavraChave) {
            // Faz a requisição à rota de busca
            fetch(`/buscar/${encodeURIComponent(palavraChave)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro na resposta da requisição');
                    }
                    return response.json();
                })
                .then(data => {
                    // Limpa a tabela antes de adicionar novos resultados
                    tabelaResultados.innerHTML = '';

                    if (Array.isArray(data) && data.length > 0) {
                        data.forEach(item => {
                            tabelaResultados.appendChild(criarLinhaTabela(item));
                        });
                    } else {
                        exibirMensagemNenhumResultado();
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar:', error);
                    tabelaResultados.innerHTML = "";
                    exibirMensagemNenhumResultado();
                });
        } else {
            // Limpa a tabela se o campo estiver vazio
            tabelaResultados.innerHTML = '';
        }
    });
});
