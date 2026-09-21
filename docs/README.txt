B3Options — substituição com integração de dados

O que mudou:
- Removidos os strikes/códigos fictícios do fluxo do Simulador.
- O Simulador consulta vencimentos e cadeia de opções pela brapi.dev.
- O strike passa a vir da série real retornada pela API.
- O código da opção passa a vir do campo symbol retornado pela API.
- O prêmio passa a usar o fechamento/média da série retornada pela API quando disponível.
- O preço do ativo é atualizado pela cotação da API quando disponível.
- Botão "Configurar dados" para inserir o token da brapi somente na sessão do navegador.
- Formatação numérica brasileira preservada.
- + ATIVO permanece disponível.
- Mercado/index passa a tentar atualizar cotações reais.

IMPORTANTE SOBRE O DADO:
A documentação atual da brapi informa que a API de opções (/api/v2/options/*) entrega dados EOD, processados após o pregão, enquanto as cotações de ações têm frequência de atualização dependente do plano. Portanto, esta versão NÃO deve ser apresentada como feed intraday de opções.
Para cadeia de opções durante o pregão com atraso de ~15 minutos, será necessária uma fonte que forneça esse nível de tempestividade para opções (por exemplo, um provedor/licença apropriado). 

Como testar:
1. Abra o site.
2. No Simulador, clique "Configurar dados".
3. Cole o token da brapi.dev se tiver um plano que inclua opções.
4. Selecione o ativo.
5. Escolha o vencimento.
6. Adicione CALL/PUT.
7. Os strikes e códigos devem vir da cadeia retornada pela API.

Sem token, a brapi disponibiliza um sandbox limitado para alguns ativos. Isso serve para validar a integração, mas não libera a cadeia completa de todos os ativos.
