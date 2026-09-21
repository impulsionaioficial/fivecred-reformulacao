# Jornada do briefing — implementação

Objetivo aprovado: completar a orientação objetivo → perfil → valor e encaminhar as escolhas ao atendimento, preservando as decisões posteriores do usuário.

## Escopo e decisões
- Home e campanha geral iniciam uma página própria de orientação pelo botão Simule aqui; a caixa com barra permanece na LP.
- Cards por perfil continuam abrindo as LPs específicas. Nas LPs de produto, o botão continua abrindo o formulário próprio.
- Três escolhas sem dados pessoais: objetivo, perfil/ativo e valor de interesse. Resultado explica uma opção a conhecer, sem afirmar aprovação, taxa ou disponibilidade.
- Resultado permite conhecer a LP, continuar em seu formulário ou conversar no WhatsApp com nome/e-mail pelo diálogo existente.
- Perfil sem modalidade definida mantém o formulário geral da origem (home ou campanha). Nenhum endpoint é substituído.
- Contexto via parâmetros validados de URL, sem dados pessoais, cookies ou armazenamento. Um perfil incompatível com a página não é reaproveitado.
- Os módulos e campos dos formulários originais, respectivos cálculos e payloads permanecem intactos.
- Webhooks pendentes, imagens reais, depoimentos, logotipos e redes adicionais não são inventados.

## Etapas
- [x] Criar e testar regras de encaminhamento e validação de contexto.
- [x] Criar orientação responsiva e resumo de resultado, com voltar/editar e fallback sem JavaScript.
- [x] Conectar CTAs e contexto aos botões gerais de WhatsApp e às páginas próprias.
- [x] Verificar todos os perfis, teclado, mobile, dados inválidos, envio WhatsApp interceptado e integridade dos formulários.
- [x] Revisar alterações, atualizar documentação e publicar a versão validada.

## Atenções de revisão
- URLs externas/injeção e parâmetros repetidos devem ser rejeitados.
- Valor selecionado fora da escala do novo perfil deve ser ajustado com explicação visível, nunca parecer crédito aprovado.
- Origem campanha deve continuar reconhecida, inclusive no caso de perfil indefinido.
- Retornar/editar deve preservar as escolhas sem misturar os dados de produtos distintos.
- Nenhum teste envia lead ou mensagem real.

## Evidências — 21/09/2026
- Regras: 16 combinações de origem/perfil; rejeição de parâmetros inválidos.
- Navegação: 60 verificações em cinco larguras, 40 fluxos da barra de valor e 16 fluxos de orientação.
- Preservação: 12 formulários, 10 arquivos de comportamento e 9 módulos CLT/FGTS intactos.
- Webhooks e WhatsApp interceptados; nenhum lead ou mensagem real enviado.
- Revisão independente: fallback sem JavaScript ampliado para oferecer explicitamente os formulários geral e da campanha. Teste falhou com 8 destinos, corrigido para incluir o nono destino.
- Revisão visual: etapas de perfil mobile e valor desktop conferidas; identidade e tamanhos de navbar preservados.
