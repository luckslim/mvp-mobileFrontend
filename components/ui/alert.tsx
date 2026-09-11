import { Icon } from '@/components/ui/icon';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Alert({
  className,
  variant,
  children,
  icon,
  iconClassName,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View> & {
  icon: LucideIcon;
  variant?: 'default' | 'destructive';
  iconClassName?: string;
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm text-foreground',
        variant === 'destructive' && 'text-destructive'
      )}>
      <View
        role="alert"
        className={cn(
          'bg-card border-border relative w-full flex-row items-center rounded-lg border px-4 py-3',
          className
        )}
        {...props}>
        <Icon
          as={icon}
          className={cn('mr-3 size-4 shrink-0', variant === 'destructive' && 'text-destructive', iconClassName)}
        />
        <View className="min-w-0 flex-1">{children}</View>
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        'text-muted-foreground text-sm leading-5',
        textClass?.includes('text-destructive') && 'text-destructive/90',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
