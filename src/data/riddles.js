export const missions = {
  toxic_spill: {
    id: 'toxic_spill',
    villainName: 'Venom',
    threatLevel: 'EXTREME',
    difficulty: 'Hard',
    timer: 25,
    riddles: [
      {
        question: "I can be cracked, made, told, and solved, but I am not always the same. Some people find me funny, others find me frustrating, and I often disappear the moment someone explains me. What am I?",
        answer: "joke",
        points: 250
      },
      {
        question: "I get bigger the more you take from me, and if you share me, I disappear faster. People often try to protect me, yet I can vanish in an instant if someone is careless. What am I?",
        answer: "hole",
        points: 250
      },
      {
        question: "I can run but never walk, I can have a mouth but never speak, and I can be full of water without ever getting thirsty. I move through places quietly and can shape the land over time. What am I?",
        answer: "river",
        points: 250
      }
    ]
  },
  vault_breaker: {
    id: 'vault_breaker',
    villainName: 'Doctor Octopus',
    threatLevel: 'MODERATE',
    difficulty: 'Medium',
    timer: 35,
    riddles: [
      {
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
        answer: "echo",
        points: 150
      },
      {
        question: "I am always in front of you but can never be seen. What am I?",
        answer: "future",
        points: 150
      },
      {
        question: "I have no wings, but I can fly. I have no eyes, but I can cry. Wherever I go, darkness follows me. What am I?",
        answer: "smoke",
        points: 150
      }
    ]
  },
  rooftop_witness: {
    id: 'rooftop_witness',
    villainName: 'Vulture',
    threatLevel: 'MINIMUM',
    difficulty: 'Easy',
    timer: 60,
    riddles: [
      {
        question: "I have cities but no houses, forests but no trees, and rivers but no water. What am I?",
        answer: "map",
        points: 100
      },
      {
        question: "What has hands but cannot clap?",
        answer: "clock",
        points: 100
      },
      {
        question: "What gets wetter the more it dries?",
        answer: "towel",
        points: 100
      },
      {
        question: "What has one eye but cannot see?",
        answer: "needle",
        points: 100
      }
    ]
  }
};
