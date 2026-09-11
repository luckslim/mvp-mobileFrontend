import { BellRing } from 'lucide-react-native';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { colors } from '../theme';

type ModerationBannerProps = {
  pendingCount: number;
  onPress?: () => void;
};

export function ModerationBanner({ pendingCount, onPress }: ModerationBannerProps) {
  if (pendingCount <= 0) return null;

  const content = (
    <View className="relative w-full overflow-hidden rounded-[26px] border border-border bg-white px-5 py-5">
      <View className="absolute -right-10 -top-16 h-40 w-40 rounded-full border border-primary/10" />
      <View className="absolute -bottom-20 left-16 h-28 w-28 rounded-full bg-secondary/10" />
      <View className="flex-row items-start justify-between">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
          <BellRing color={colors.forest} size={20} strokeWidth={2.3} />
        </View>
        <View className="min-w-[60px] items-center rounded-2xl bg-secondary px-3 py-2">
          <Text className="text-2xl font-extrabold leading-7 text-secondary-foreground">{pendingCount}</Text>
          <Text className="text-[10px] font-bold text-secondary-foreground">pendentes</Text>
        </View>
      </View>

      <View className="mt-5 max-w-[340px] pr-2">
        <Text className="text-sm font-bold text-primary">Fila de moderação</Text>
        <Text
          adjustsFontSizeToFit
          className="mt-1.5 text-lg font-extrabold leading-7 text-primary"
          minimumFontScale={0.8}
          numberOfLines={1}
        >
          {pendingCount} evento{pendingCount === 1 ? '' : 's'} aguardando sua avaliação
        </Text>
      </View>
    </View>
  );

  if (!onPress) {
    return <View role="alert">{content}</View>;
  }

  return (
    <Button
      accessibilityLabel={`${pendingCount} eventos aguardando sua avaliação. Abrir fila de moderação.`}
      className="h-auto w-full rounded-[26px] bg-white p-0 shadow-sm shadow-black/5"
      onPress={onPress}
      variant="ghost"
    >
      {content}
    </Button>
  );
}
