import { Chapter, ContentType } from './types';

export const EBOOK_CONTENT: Chapter[] = [
  {
    id: 'intro',
    title: 'Introdução',
    subtitle: 'O que você vai aprender aqui',
    imagePrompt: 'A mystical open door in the middle of a nebula, pure white light pouring out, symbolizing the awakening of the mind and subconscious exploration, digital art, 8k, fantasy style, cinematic lighting',
    blocks: [
      {
        type: ContentType.QUOTE,
        content: 'Você não falha em hábitos por falta de disciplina; você falha porque está tentando mudar conscientemente algo que é subconsciente.'
      },
      {
        type: ContentType.TEXT,
        content: 'O subconsciente é o sistema operacional silencioso que determina mais de 90% dos seus comportamentos, emoções, hábitos e reações. Ele não distingue certo ou errado — apenas repete o programado.'
      },
      {
        type: ContentType.TEXT,
        content: 'Este guia interativo vai te mostrar como ele aprende, como cria sua identidade, como registra emoções, e principalmente como você pode reprogramá-lo para transformar sua vida.'
      },
      {
        type: ContentType.SUBHEADER,
        content: 'Você aprenderá:'
      },
      {
        type: ContentType.LIST,
        content: [
          'Como crenças, traumas e repetições moldam sua realidade interna.',
          'Como reestruturar hábitos, pensamentos e padrões emocionais.',
          'Técnicas práticas de reprogramação que realmente funcionam.',
          'Um programa de 30 dias para iniciar uma nova identidade mental.'
        ]
      },
      {
        type: ContentType.TEXT,
        content: 'Ao final, você terá um mapa completo para reescrever sua mente subconsciente.'
      }
    ]
  },
  {
    id: 'chapter-1',
    title: 'Capítulo 1',
    subtitle: 'O que é o subconsciente e como ele funciona',
    imagePrompt: 'A giant iceberg floating in a dark deep ocean, the top 10% visible is normal ice, but the massive 90% underwater is made of glowing golden mechanical gears, clockwork, and neural networks, cinematic lighting, hyperrealistic, 8k',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'O subconsciente opera silenciosamente, registrando padrões sem que você perceba. É a razão pela qual você <strong>"sabe o que fazer, mas não faz".</strong>'
      },
      {
        type: ContentType.QUOTE,
        content: 'A mente consciente quer mudar. O subconsciente quer manter você seguro(a). Ele entende que, Segurança = Familiaridade.'
      },
      {
        type: ContentType.TEXT,
        content: 'Se o novo é desconhecido, ele resiste.'
      },
      {
        type: ContentType.TEXT,
        content: 'O subconsciente é a parte da mente que armazena informações, automatiza processos e produz respostas rápidas.'
      },
      {
        type: ContentType.SUBHEADER,
        content: 'Ele trabalha sem esforço consciente, dirigindo:'
      },
      {
        type: ContentType.LIST,
        content: [
          'Comportamentos automáticos.',
          'Memória emocional.',
          'Hábitos.',
          'Percepções.',
          'Crenças profundas.',
          'Linguagem corporal.',
          'Respostas fisiológicas.'
        ]
      },
      {
        type: ContentType.SUBHEADER,
        content: 'Como ele aprende:'
      },
      {
        type: ContentType.LIST,
        content: [
          'Repetição.',
          'Emoção intensa.',
          'Imaginação vívida.',
          'Experiências marcantes.'
        ]
      },
      {
        type: ContentType.TEXT,
        content: 'O subconsciente funciona por associação, não por lógica. Se algo foi repetido muitas vezes, ele entende como <strong>"verdade".</strong>'
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-1-automatic-behaviors',
        label: 'Exercício 1: Identificando respostas automáticas',
        placeholder: 'Liste 5 comportamentos que você faz sem pensar (ex: roer unhas, pegar o celular ao acordar, se justificar quando criticado)...',
        content: [
            'Comportamento 1',
            'Comportamento 2',
            'Comportamento 3',
            'Comportamento 4',
            'Comportamento 5'
        ]
      },
      {
        type: ContentType.QUOTE,
        content: 'Esses são códigos do seu subconsciente.'
      }
    ]
  },
  {
    id: 'chapter-2',
    title: 'Capítulo 2',
    subtitle: 'O subconsciente e a formação da identidade',
    imagePrompt: 'A young child looking into a mirror. The reflection in the mirror is not the child, but the powerful superhero Superman, symbolizing the child\'s inner potential and self-belief. The scene should be heartwarming and inspiring. Cinematic lighting, digital art, hyperrealistic, 8k',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'Sua identidade não é quem você é — é quem você acredita ser. Ela se forma principalmente na infância por mensagens familiares e experiências repetidas.'
      },
      {
        type: ContentType.TEXT,
        content: 'O subconsciente registra rótulos como "isso define você". Exemplos: <strong>"Você é tímido(a)", "Você é forte", "Você é ansioso(a)".</strong> Com o tempo, você age para confirmar essa identidade.'
      },
      {
        type: ContentType.EXERCISE,
        id: 'ex-2-identity-phrase',
        label: 'Exercício 2: Quais identidades você assumiu?',
        content: 'Complete a frase: "Desde pequeno(a), eu aprendi que eu era uma pessoa que..."',
        placeholder: 'Digite sua resposta aqui...'
      },
      {
        type: ContentType.SUBHEADER,
        content: 'A Imagem da Identidade'
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-2-reflection',
        label: 'Exercício 2.1: Reflexão Profunda',
        placeholder: 'Tudo o que você vive hoje é uma expressão da sua autoimagem interna. Responda com sinceridade:',
        inputType: 'textarea',
        content: [
            'Como você acredita que é hoje?',
            'Que comportamentos essa identidade produz?',
            'Como seria a identidade que você deseja criar?',
            'Quais hábitos essa nova identidade teria?'
        ]
      },
      {
        type: ContentType.TEXT,
        content: 'Quando uma identidade se instala, o subconsciente passa a proteger esse padrão, mesmo que ele cause sofrimento. Por quê?'
      },
      {
        type: ContentType.TEXT,
        content: 'Porque o subconsciente não busca felicidade - ele busca familiaridade.'
      },
      {
        type: ContentType.TEXT,
        content: 'Tudo que foge do conhecido (mesmo sendo positivo) gera resitência.'
      },
      {
        type: ContentType.TEXT,
        content: 'É por isso que tantas pessoas voltam aos padrões antigos, mesmo entendendo racionalmente que isso não é saudável.'
      },
      {
        type: ContentType.QUOTE,
        content: 'Identidade → Comportamento → Realidade. Não é o comportamento que muda a identidade. É a identidade que muda o comportamento.'
      }
    ]
  },
  {
    id: 'chapter-3',
    title: 'Capítulo 3',
    subtitle: 'Crenças, traumas e registros emocionais',
    imagePrompt: 'Cross-section of the ground showing a beautiful ancient tree above, but deep underground the roots are wrapped around glowing amber stones containing frozen memories, intricate detail, fantasy art, magical atmosphere',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'As crenças subconscientes são conclusões que você tirou sobre si mesmo e sobre o mundo.'
      },
      {
        type: ContentType.SUBHEADER,
        content: 'Se na infância você ouviu repetidamente:'
      },
      {
        type: ContentType.LIST,
        content: [
          'Você é difícil.',
          'Você da trabalho.',
          'Ninguém tem paciência com você.',          
        ]
      },
      {
        type: ContentType.SUBHEADER,
        content: 'O cérebro registra:'
      },
      {
        type: ContentType.QUOTE,
        content: 'Para ser aceito, preciso me calar, preciso agradar, não posso atrapalhar...'
      },      
      {
        type: ContentType.TEXT,
        content: 'Já os traumas não são eventos, são interpretações emocionais congeladas e não precisam ser grandes; muitas vezes são pequenas experiências repetidas.'
      },
      {
        type: ContentType.LIST,
        content: [
          'Emoções não processadas.',
          'Medo.',
          'Culpa.',
          'Rejeição.',
          'Comparações.',
          'Críticas.'
        ]
      },
            {
        type: ContentType.TEXT,
        content: 'Esses registros se transformam em filtros perceptivos. '
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-3-beliefs-map',
        label: 'Exercício 3: Mapa das crenças-raiz',
        placeholder: 'Escreva crenças que você ouviu ou internalizou sobre:',
        inputType: 'textarea',
        content: [
          'Você',
          'Amor',
          'Dinheiro',
          'Sucesso',
          'Seu valor'
        ]
      }
    ]
  },
  {
    id: 'chapter-4',
    title: 'Capítulo 4',
    subtitle: 'O subconsciente e os hábitos',
    imagePrompt: 'A mesmerizing golden infinity symbol loop glowing in a dark void, with sparks of energy travelling along the path, symbolizing habits and repetition loops, abstract, minimal, high quality 3d render',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'Hábitos não são comportamentos, são programações neurológicas. A mente consciente decide, mas o subconsciente executa. Esses programas se formam por três elementos: <strong>Gatilho, Comportamento e Recompensa Emocional.</strong>'
      },
      {
        type: ContentType.SUBHEADER,
        content: 'Como quebrar um hábito:'
      },
      {
        type: ContentType.LIST,
        content: [
          'Mude o gatilho.',
          'Substitua o comportamento.',
          'Ressignifique a recompensa.'
        ]
      },
      {
        type: ContentType.SUBHEADER,
        content: 'O segredo?'
      },
      {
        type: ContentType.TEXT,
        content: 'Instalar o hábito na linguagem do subconsciente:'
      },
      {
        type: ContentType.LIST,
        content: [
         'Simples.',
         'Emocional.',
         'Visual.',
         'Conectado à identidade (coerente).'
        ]
      },

      {
        type: ContentType.INPUT_LIST,
        id: 'ex-4-habit-diagnosis-part1',
        label: 'Exercício 4: Diagnóstico de Hábitos',
        placeholder: 'Responda às perguntas abaixo para diagnosticar o ciclo do seu hábito:',
        inputType: 'textarea',
        content: [
          'Hábito a mudar',
          'Gatilho (O que acontece antes?)',
          'Emoção (O que sente?)',
          'Recompensa (O que ganha com isso?)'
        ]
      },
      {
        type: ContentType.TEXT,
        content: 'Agora, escolha um hábito mínimo, tão pequeno que seja impossível de falhar (ex.: Beber um gole d´água ao acordar, escrever uma frase por dia). Pratique o novo hábito mínimo por 7 dias seguidos, sempre com a mesma imagem interna.'
      },
      {
        type: ContentType.TEXT,
        content: '<strong>Importante:</strong> ao escolher um novo hábito associe emoção, imagem, uma frase e uma recompensa.'
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-4-habit-diagnosis-part1-1',
        label: 'Exercício 4.1: Novo Hábito Mínimo',
        placeholder: 'Qual será o seu novo hábito mínimo? Preencha os campos abaixo para estruturar o novo ciclo:',
        inputType: 'textarea',
        content: [
          'Novo Hábito Mínimo (Impossível de falhar)',
          'Novo Gatilho (O que acontece antes?)',
          'Nova Emoção (O que sente ao fazer?)',
          'Nova Recompensa (O que ganha com isso?)'
        ]
      }
    ]
  },
  {
    id: 'chapter-5',
    title: 'Capítulo 5',
    subtitle: 'Sabotadores internos e mecanismos de defesa',
    imagePrompt: 'A dramatic shadow puppet theater scene, where a small harmless hand is casting a giant scary monster shadow on the wall, representing fear and internal sabotage, artistic, high contrast, conceptual',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'Sabotadores são programas criados para te "proteger" de experiências negativas passadas. <strong>Exemplos: procrastinação, autocrítica, perfeccionismo, medo de rejeição.</strong>'
      },
       {
        type: ContentType.TEXT,
        content: 'Os mecanismos de defesa funcionam como alarmes falsos e o subconsciente evita qualquer coisa que lembre uma dor antiga, por exemplo: <strong>"Se esse vídeo não ficar perfeito, irão rir de mim".</strong> Essa é a voz sabotadora do perfeccionismo tentando evitar que eu sofra rejeição.'
      },
      {
        type: ContentType.QUOTE,
        content: 'O que você está deixando de fazer ou acha que está fazendo errado?'
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-5-saboteurs',
        label: 'Exercício 5: A Voz Sabotadora',
        placeholder: 'Esse exercício dissolve 70% das sabotagens, pois traz consciência à intenção oculta. Escreva:',
        inputType: 'textarea',
        content: [
          'O que a voz sabotadora tenta evitar?',
          'O que ela teme que aconteça se eu mudar?',
          'Qual intenção positiva existe por trás desse sabotador?'
        ]
      }
    ]
  },
  {
    id: 'chapter-6',
    title: 'Capítulo 6',
    subtitle: 'Emoções: a linguagem do subconsciente',
    imagePrompt: 'An explosion of colorful powder and liquid mixing together in slow motion, vibrant blues, reds and purples, representing emotions flowing and mixing, macro photography style, abstract, energetic',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'O subconsciente não entende palavras — entende sensações. Por isso emoções são o acelerador da aprendizagem. Ele responde primeiro às emoções, e só depois à lógica.'
      },
      {
        type: ContentType.QUOTE,
        content: 'Não basta querer. É preciso sentir.'
      },
      {
        type: ContentType.SUBHEADER,
        content: 'Exercício 6: “Mini-ritual” de 60 segundos'
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-6-mini-ritual',
        label: 'Exercício 6: “Mini-ritual” de 60 segundos',
        inputType: 'textarea',
        placeholder: 'Use este espaço para registrar suas intenções e observações para cada passo do ritual.',
        content: [
            'Inspire profundamente 3 vezes e lembre-se de uma memória feliz',
            'Ative a emoção escolhida (traga a memória por alguns segundos)',
            'Toque o peito ou o pulso (âncora física). Escreva abaixo onde você tocou.',
            'Crie uma frase curta que represente a sua emoção',
        ]
      },
      {
        type: ContentType.TEXT,
        content: '[ACTION_STEP] Execute o hábito imediatamente'
      },
      {
        type: ContentType.QUOTE,
        content: 'Isso informa ao subconsciente: "Quando sinto isso → eu ajo assim." Com repetição emocional, o hábito deixa de ser uma tarefa e se torna uma resposta automática do corpo.'
      },
    ]
  },
  {
    id: 'chapter-7',
    title: 'Capítulo 7',
    subtitle: 'Neuroplasticidade e reprogramação',
    imagePrompt: 'Close up view of brain neurons firing, the synaptic connections are turning from dull grey to glowing bright gold and electric blue, representing rewiring and neuroplasticity, scientific illustration meets art, 8k',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'A neuroplasticidade é a capacidade do cérebro de mudar estruturas, conexões e padrões.'
      },
      {
        type: ContentType.SUBHEADER,
        content: 'O que isso significa na prática?'
      },      
      {
        type: ContentType.LIST,
        content: [
        '✓ Novos hábitos criam novos caminhos neurais.',
        '✓ Velhos padrões enfraquecem quando não usados.',
        '✓ Repetir diariamente muda seu cérebro fisicamente.',
        '✓ Emoção acelera as alterações.',
        '✓ Foco direcionado cria caminhos mais fortes.'
        ]
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-7-reprogramming',
        label: 'Exercício 7: Reprogramando um padrão',
        placeholder: 'Quanto mais você pratica um novo padrão, mais seu cérebro entende: "isso é quem você é agora."',
        inputType: 'textarea',
        content: [
            'Intenção clara (Ex: "Quero ser disciplinado(a)")',
            'Escreva micro comportamentos que sustentam essa nova identidade. Mas lembre-se de praticar na vida real.'
        ]
      }
    ]
  },
  {
    id: 'chapter-8',
    title: 'Capítulo 8',
    subtitle: 'Imaginação e Visualização',
    imagePrompt: 'A person sitting in a lotus position meditating, with a thought bubble that is becoming a real 3D holographic city forming above their head, surrealism, dreamlike atmosphere, soft pastel colors',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'O subconsciente não diferencia imaginação de realidade. Quando você imagina, ativa as mesmas redes neurais da experiência real.'
      },
      {
        type: ContentType.TEXT,
        content: 'A visualização deve ser específica, emocional, vívida e repetida.'
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-8-visualization',
        label: 'Exercício 8: Roteiro de Visualização Guiada',
        placeholder: 'Feche os olhos e veja sua nova identidade vivendo um dia comum. Descreva aqui:',
        inputType: 'textarea',
        content: [
            'Como ela age?',
            'Como se sente?',
            'Como reage aos problemas?',
            'Como fala?'
        ]
      }
    ]
  },
  {
    id: 'chapter-9',
    title: 'Capítulo 9',
    subtitle: 'Ambientes, gatilhos e condicionamentos',
    imagePrompt: 'A surreal room where the furniture and walls are made of puzzle pieces, some floating in the air, a chameleon is changing colors to match the wall, representing environmental adaptation, Dali style, vivid',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'O ambiente é um dos maiores programadores subconscientes. Você repete o que o ambiente reforça. Tudo cria condicionamentos: cores, pessoas, sons, rotinas, objetos.'
      },
      {
        type: ContentType.TEXT,
        content: '<strong>Por isso, mudanças internas exigem:</strong>'
      },
      {
        type: ContentType.LIST,
        content: [
         'Reorganizar o seu espaço.',
         'Mudar a sua rotina.',
         'Identificar e reduzir os gatilhos mentais.',
         'Criar micro-recompensas.'
        ]
      },      
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-9-environment',
        label: 'Exercício 9: Curadoria Ambiental',
        placeholder: 'Liste o que no seu ambiente atual te aproxima e também o que te afasta da identidade desejada:',
        inputType: 'textarea',
        content: [
          'O que no meu ambiente atual me APROXIMA da minha nova identidade?',
          'O que no meu ambiente atual me AFASTA da minha nova identidade?'
        ]
      }
    ]
  },
  {
    id: 'chapter-10',
    title: 'Capítulo 10',
    subtitle: 'Técnicas de reprogramação subconsciente',
    imagePrompt: 'A highly detailed bioluminescent human brain floating in a dark space, with new neural pathways forming in bright gold light, representing the rewiring of the subconscious mind, cinematic, 8k, photorealistic',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'As técnicas mais eficazes incluem: <strong>Visualização</strong> emocional, <strong>Afirmações</strong> estruturadas, <strong>Escrita</strong> direcionada, <strong>Exposição</strong> gradual ao novo, <strong>Repetição</strong> diária, Estados de <strong>relaxamento</strong> e Auto-<strong>observação.</strong>'
      },
      {
        type: ContentType.CHECKLIST,
        id: 'ex-10-routine',
        label: 'Exercício 10: Escolha 3 técnicas para os próximos 7 dias',
        maxSelections: 3,
        minSelections: 3,
        content: [
          'Visualização Emocional',
          'Afirmações Estruturadas',
          'Escrita Direcionada',
          'Exposição Gradual',
          'Auto-observação',
          'Meditação e Relaxamento',
          'Repetição Diária'
        ]
      }
    ]
  },
  {
    id: 'chapter-11',
    title: 'Capítulo 11',
    subtitle: 'Exercícios diários para reprogramar a mente',
    imagePrompt: 'A peaceful morning sunrise seen through a window, with a leather notebook and a steaming cup of coffee on the sill, golden hour light, cozy, photorealistic, focus on the notebook',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'Um ciclo diário simples:'
      },
      {
        type: ContentType.LIST,
        content: [
          '✓ <strong>Manhã</strong>: Afirmações + Visualização.',
          '✓ <strong>Tarde</strong>: Pequenos atos da nova identidade.',
          '✓ <strong>Noite</strong>: Escrita + Revisão emocional.',
          '✓ <strong>Sempre</strong>: Micro decisões alinhadas.',
        ]
      },
       {
        type: ContentType.INPUT_LIST,
        id: 'ex-11-daily-pillars',
        label: 'Exercício 11: Diário dos 3 Pilares (Hoje)',
        inputType: 'textarea',
        content: [
            'Como eu pensei hoje?',
            'Como eu me senti hoje?',
            'Como eu agi hoje?'
        ]
      }
    ]
  },
  {
    id: 'chapter-12',
    title: 'Capítulo 12',
    subtitle: 'Os 30 dias de reprogramação',
    imagePrompt: 'A spiral staircase made of pure light leading up into the clouds e blue sky, birds flying around, representing the 30 day journey of ascent and transformation, heavenly, epic, hopeful',
    blocks: [
      {
        type: ContentType.TEXT,
        content: 'Siga este foco semanal para consolidar sua mudança.'
      },
      {
        type: ContentType.CHECKLIST,
        id: 'ex-12-weekly-focus',
        label: 'Marque as semanas conforme for concluindo:',
        isOptional: true,
        content: [
          'SEMANA 1 - Identidade: Reescrever crenças e rótulos.',
          'SEMANA 2 - Emoções: Regular e ressignificar estados internos.',
          'SEMANA 3 - Ação: Criar micro hábitos da nova versão.',
          'SEMANA 4 - Consolidação: Reforçar a identidade todos os dias.'
        ]
      },
      {
        type: ContentType.QUOTE,
        content: 'Reprogramar o subconsciente não é sobre "pensar positivo", mas sobre viver de forma coerente.'
      }
    ]
  },
  {
    id: 'bonus',
    title: 'Bônus',
    subtitle: 'Afirmações e Ferramentas Finais',
    imagePrompt: 'A magical golden key floating in a hand, sparkling with magical particles and light, bokeh background, representing the key to the mind, fantasy, high detail',
    blocks: [
      {
        type: ContentType.SUBHEADER,
        content: 'Afirmações Prontas'
      },
      {
        type: ContentType.LIST,
        content: [
          'Eu ajo como a pessoa que quero me tornar.',
          'Eu mereço o melhor e me permito recebê-lo(a).',
          'Eu crio minha realidade a partir do que repito.'
        ]
      },
      {
        type: ContentType.INPUT_LIST,
        id: 'ex-bonus-journaling',
        label: 'Escrita profunda',
        placeholder: 'Não basta querer. É preciso sentir.',
        inputType: 'textarea',
        content: [
            'Quem eu preciso deixar de ser?',
            'O que minha nova identidade não tolera mais?'
        ]
      }
    ]
  }
];