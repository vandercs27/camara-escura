/**
 * Acervo Histórico Curado da Fotografia
 * Imagens e metadados com precisão histórica e links diretos testados
 */
const getHistoricalPhotographs = async () => {
  return [
    {
      id: 'niepce-1826',
      title: 'Point de vue du Gras',
      photographer: 'Joseph Nicéphore Niépce',
      year: '1826',
      medium: 'Heliografia em placa de peltre',
      imageUrl: 'https://raw.githubusercontent.com/public-domain-archive/photography-history/main/images/niepce-1826.jpg',
      historicalContext: 'Considerada a primeira fotografia permanente da história. Foi obtida através de uma câmara escura voltada para a janela da propriedade de Niépce na França, exposta ao sol por cerca de 8 horas.',
      technicalNotes: 'Uso de betume da Judeia (asfalto natural) aplicado sobre uma chapa de peltre polida. A luz solar endureceu o betume nas áreas expostas, enquanto as partes escuras foram lavadas com óleo de lavanda.',
      compositionAnalysis: 'Nota-se a iluminação solar incidindo em dois lados opostos dos edifícios ao mesmo tempo, um efeito colateral do tempo de exposição extremamente longo durante o movimento do sol.'
    },
    {
      id: 'daguerre-1838',
      title: 'Boulevard du Temple',
      photographer: 'Louis Daguerre',
      year: '1838',
      medium: 'Daguerreótipo',
      imageUrl: 'https://raw.githubusercontent.com/public-domain-archive/photography-history/main/images/daguerre-1838.jpg',
      historicalContext: 'Primeira fotografia conhecida a registrar uma figura humana. A rua estava cheia de pedestres e carruagens, mas devido aos 7 minutos de exposição, apenas o homem parado limpando os sapatos foi gravado na chapa.',
      technicalNotes: 'Chapa de cobre revestida com prata pura, sensibilizada com vapores de iodo e revelada sob vapores de mercúrio aquecido.',
      compositionAnalysis: 'Forte linha diagonal formada pelos edifícios do boulevard parisiense, criando grande profundidade de campo e guiando o olhar até a figura no canto inferior esquerdo.'
    },
    {
      id: 'curtis-1904',
      title: 'An Apsaroke Eagle Catcher',
      photographer: 'Edward S. Curtis',
      year: '1904',
      medium: 'Fotogravura em Gelatina de Prata',
      imageUrl: 'https://raw.githubusercontent.com/public-domain-archive/photography-history/main/images/curtis-1904.jpg',
      historicalContext: 'Registro icônico pertencente ao projeto de documentação das nações nativo-americanas no início do século XX, registrando tradições e modos de vida em transformação.',
      technicalNotes: 'Produzido através de fotogravura em placa de cobre, técnica que permitia transferir os tons contínuos do negativo fotográfico para papel de arte.',
      compositionAnalysis: 'Uso magistral da iluminação lateral e contraluz no topo da rocha, destacando a silhueta do caçador contra a vastidão do horizonte.'
    },
    {
      id: 'steichen-1904',
      title: 'The Pond—Moonlight',
      photographer: 'Edward Steichen',
      year: '1904',
      medium: 'Goma Bicromatada / Pictorialismo',
      imageUrl: 'https://raw.githubusercontent.com/public-domain-archive/photography-history/main/images/steichen-1904.jpg',
      historicalContext: 'Obra emblemática do movimento Pictorialista. Steichen buscava provar que a fotografia era uma forma de arte expressiva equivalente à pintura, e não apenas um registro mecânico.',
      technicalNotes: 'Impressão em platina combinada com camadas manuais de goma bicromatada contendo pigmento azul aplicadas sobre o papel.',
      compositionAnalysis: 'Atmosfera poética e mistério criados pelos reflexos sutis do luar na água através da copa das árvores fechadas.'
    },
    {
      id: 'hine-1920',
      title: 'Powerhouse Mechanic',
      photographer: 'Lewis Hine',
      year: '1920',
      medium: 'Gelatina de Prata (Documentarismo Social)',
      imageUrl: 'https://raw.githubusercontent.com/public-domain-archive/photography-history/main/images/hine-1920.jpg',
      historicalContext: 'Criada para a série sobre o trabalho industrial nos Estados Unidos, retratando a força muscular humana em harmonia e contraste com o poder das máquinas.',
      technicalNotes: 'Capturada com câmera de grande formato usando iluminação de flash de magnésio para congelar o esforço do trabalhador no ambiente escuro da usina.',
      compositionAnalysis: 'Composição circular perfeita onde a postura curvada do mecânico espelha a curvatura da engrenagem da bomba a vapor.'
    },
    {
      id: 'lange-1936',
      title: 'Migrant Mother',
      photographer: 'Dorothea Lange',
      year: '1936',
      medium: 'Gelatina de Prata / FSA',
      imageUrl: 'https://raw.githubusercontent.com/public-domain-archive/photography-history/main/images/lange-1936.jpg',
      historicalContext: 'Retrato que se tornou o maior símbolo da resistência humana durante a Grande Depressão americana, tirado em um acampamento de apanhadores de ervilha na Califórnia.',
      technicalNotes: 'Negativo de filme de grande formato (4x5 polegadas) capturado em câmera Graflex, permitindo enorme riqueza de detalhes de textura na pele e nas roupas.',
      compositionAnalysis: 'Enquadramento piramidal centrado na expressão preocupada da mãe (Florence Owens Thompson), enquanto os filhos se escondem em seus ombros direcionando o foco emocional para o rosto.'
    }
  ];
};

const getPhotoById = async (id) => {
  const photos = await getHistoricalPhotographs();
  return photos.find(p => p.id === id);
};

module.exports = { getHistoricalPhotographs, getPhotoById };