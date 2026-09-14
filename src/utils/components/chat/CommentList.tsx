import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";

const commentList = [
  {
    user: "Marina Silva",
    handle: "@marinasilva",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    comment:
      "Passei aqui e foi uma experiência incrível. A paisagem é tão tranquila e bem cuidada. Vale muito a pena visitar e aproveitar o momento com calma.",
    mood: "😍",
  },
  {
    user: "Pedro Costa",
    handle: "@pedrocosta",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    comment:
      "Alguém já esteve neste lugar? Quero voltar com a família. O visual é maravilhoso e parece um ponto perfeito para fotos e relaxamento.",
    mood: "📸",
  },
  {
    user: "Laura Mendes",
    handle: "@lauramendes",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
    comment:
      "Foi muito bom ver um lugar tão bonito e preservado. A natureza parece estar bem cuidada e isso faz toda a diferença na experiência.",
    mood: "💚",
  },
  {
    user: "Thiago Rocha",
    handle: "@thiagorocha",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    comment:
      "Esse lugar merece atenção. A trilha, o ar fresco e a beleza do cenário deixam qualquer pessoa com vontade de conhecer mais pontos assim.",
    mood: "🌿",
  },
  {
    user: "Beatriz Nunes",
    handle: "@beatriznunes",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
    comment:
      "Tive a sensação de estar em um lugar especial. O ambiente é tranquilo, acolhedor e muito inspirador para quem curte natureza e cultura.",
    mood: "✨",
  },
  {
    user: "Rafael Souza",
    handle: "@rafaelsouza",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
    comment:
      "Gostei bastante da proposta do local. Fica bem claro que a preservação da natureza também faz parte da experiência. Muito bonito e bem pensado.",
    mood: "🌎",
  },
  {
    user: "Camila Reis",
    handle: "@camilareis",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
    comment:
      "Que lugar incrível! Me lembrou a importância de valorizar paisagens naturais e cuidar do meio ambiente em cada visita que fazemos.",
    mood: "🌱",
  },
  {
    user: "Eduardo Lima",
    handle: "@eduardolima",
    avatar:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=500&q=80",
    comment:
      "Um destino realmente bonito para passar o dia. O cenário é de tirar o fôlego e dá vontade de conhecer todos os cantos do lugar.",
    mood: "🏞️",
  },
  {
    user: "Sofia Almeida",
    handle: "@sofiaalmeida",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    comment:
      "Adorei a energia do lugar. Parece ser um espaço perfeito para quem ama natureza e também para quem busca um ambiente mais tranquilo.",
    mood: "😊",
  },
  {
    user: "Lucas Ferreira",
    handle: "@lucasferreira",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
    comment:
      "Fiquei com vontade de visitar novamente. Esse tipo de lugar mostra como a natureza pode ser um convite para lazer, reflexão e preservação.",
    mood: "💬",
  },
];

export function CommentList() {
  return (
    <View className="w-full px-5 pb-8 pt-5">
      <Text className="mb-4 text-[28px] font-extrabold tracking-tight text-[#123A2A]">
        Comentários da comunidade
      </Text>

      <View className="gap-3">
        {commentList.map((item) => (
          <View
            key={item.handle}
            className="rounded-[24px] border border-[#dfe9dc] bg-white p-4 shadow-sm shadow-black/5"
          >
            <View className="flex-row items-start gap-3">
              <Image
                source={{ uri: item.avatar }}
                style={{ width: 46, height: 46, borderRadius: 23 }}
              />

              <View className="flex-1">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-[15px] font-extrabold text-[#123A2A]">
                      {item.user}
                    </Text>
                    <Text className="text-[12px] text-[#5c7568]">
                      {item.handle}
                    </Text>
                  </View>

                  <Text className="text-xl">{item.mood}</Text>
                </View>

                <Text className="mt-3 text-[14px] leading-6 text-[#3d5145]">
                  {item.comment}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
