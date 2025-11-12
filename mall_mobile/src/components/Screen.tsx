import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = ViewProps & {
  padded?: boolean;
  edges?: SafeAreaViewProps['edges'];
};

export default function Screen({ children, padded = true, style, edges, ...rest }: Props) {
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={edges}
    >
      <View
        style={[
          { flex: 1, backgroundColor: colors.bg, paddingHorizontal: padded ? 16 : 0 },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}