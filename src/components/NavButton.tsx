// NavButton.tsx
import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, RelativePathString } from 'expo-router';  
import Colors from '../constants/Colors';

type ButtonProps = {
    text: string;
    href: RelativePathString;  
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const NavButton = forwardRef<View | null, ButtonProps>(
    ({ text, href, ...pressableProps }, ref) => {
      return (
        <Link href={href} asChild>
          <Pressable ref={ref} {...pressableProps} style={styles.container}>
            <Text style={styles.text}>{text}</Text>
          </Pressable>
        </Link>
      );
    }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default NavButton;
