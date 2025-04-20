/*
 * This file is part of Meal Manager.
 *
 * Meal Manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Meal Manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Meal Manager. If not, see <http://www.gnu.org/licenses/>.
 */

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
