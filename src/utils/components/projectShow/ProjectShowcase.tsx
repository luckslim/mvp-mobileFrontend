import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";
import { colors } from "../../../theme";

const highlightCards = [
  {
    title: "Turismo local",
    text: "Descubra paisagens, cultura e experiências que valorizam a identidade de Magé.",
    accent: "#E7F3D8",
    icon: "✦",
  },
  {
    title: "Preservação",
    text: "Todo ponto turístico também é um convite para proteger rios, trilhas e biodiversidade.",
    accent: "#DCEFE7",
    icon: "❋",
  },
  {
    title: "Conscientização",
    text: "A visita com respeito ao meio ambiente fortalece a comunidade e o futuro da região.",
    accent: "#F5EFD9",
    icon: "◎",
  },
];

const bannerImages = {
  cover:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  forest:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
  river:
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80",
};

export function ProjectShowcase() {
  return (
    <View className="w-full px-5 pb-8 pt-6">
      <View className="overflow-hidden rounded-[30px] border border-[#dfe9dc] bg-[#eef4ec] shadow-sm shadow-black/5">
        <Image
          source={{ uri: bannerImages.cover }}
          style={{ width: "100%", height: 220 }}
          resizeMode="cover"
        />

        <View className="p-5">
          <Text className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#4b7a59]">
            Magé Verde
          </Text>
          <Text className="mt-2 text-[28px] font-extrabold leading-tight text-[#123A2A]">
            Natureza, cultura e turismo consciente.
          </Text>
          <Text className="mt-3 text-[15px] leading-6 text-[#4d5f56]">
            A natureza é a base da nossa identidade. Quando valorizamos
            paisagens, trilhas, rios e biodiversidade, também fortalecemos o
            futuro da comunidade. O Magé Verde reúne pontos turísticos locais
            para inspirar visitas responsáveis e ações de preservação ambiental.
          </Text>
        </View>
      </View>

      <View className="mt-6 flex-row flex-wrap justify-between gap-3">
        {highlightCards.map((card) => (
          <View
            key={card.title}
            className="w-[31%] min-w-[120px] flex-1 rounded-[22px] border border-[#dfe9dc] p-4"
            style={{ backgroundColor: card.accent }}
          >
            <Text className="text-2xl">{card.icon}</Text>
            <Text className="mt-3 text-base font-extrabold text-[#123A2A]">
              {card.title}
            </Text>
            <Text className="mt-2 text-[13px] leading-5 text-[#3a4d42]">
              {card.text}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-6 overflow-hidden rounded-[30px] border border-[#dfe9dc] bg-[#123A2A]">
        <Image
          source={{ uri: bannerImages.forest }}
          style={{ width: "100%", height: 170 }}
          resizeMode="cover"
        />

        <View className="p-5">
          <Text className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#dfeecf]">
            Projeto Magé Verde
          </Text>
          <Text className="mt-2 text-[24px] font-extrabold leading-tight text-white">
            Divulgação de lugares incríveis e incentivo à preservação ambiental.
          </Text>
          <Text className="mt-3 text-[15px] leading-6 text-[#dfeae2]">
            Este app foi pensado para divulgar pontos turísticos de Magé e
            mostrar que turismo e natureza podem caminhar juntos. A ideia é
            despertar o interesse pela região, valorizar a cultura local e
            incentivar cada visita a ser feita com respeito, consciência e
            cuidado pelo meio ambiente.
          </Text>
        </View>
      </View>

      <View className="mt-6 overflow-hidden rounded-[28px] border border-[#dfe9dc] bg-[#edf7ee]">
        <View className="flex-row items-center gap-3 p-4">
          <Image
            source={{ uri: bannerImages.river }}
            style={{ width: 88, height: 88, borderRadius: 18 }}
            resizeMode="cover"
          />

          <View className="flex-1">
            <Text className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#4b7a59]">
              Cuidar da natureza
            </Text>
            <Text className="mt-1 text-[18px] font-extrabold text-[#123A2A]">
              Cada visita pode virar um gesto de proteção.
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-6 rounded-[24px] border border-[#dfe9dc] bg-white p-5">
        <Text className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#4b7a59]">
          Por que isso importa
        </Text>
        <Text className="mt-2 text-[15px] leading-6 text-[#3a4d42]">
          Quando a comunidade conhece e se orgulha dos seus atrativos naturais,
          ela também se mobiliza para protegê-los. O Magé Verde é uma ponte
          entre descoberta, educação ambiental e turismo sustentável.
        </Text>
      </View>
    </View>
  );
}
