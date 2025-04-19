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
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { Stack } from "expo-router";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    <Stack screenOptions={{ headerShown: false }} />
    return (
        
        <Tabs 
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: useClientOnlyValue(false, false),
            }}>

            <Tabs.Screen 
                name="sign-in"
                options={{
                    title: 'Sign In Screen',
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    href: null,
                }}
            />
            
            <Tabs.Screen 
                name="sign-up"
                options={{
                    title: 'Sign Up Screen',
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    href: null,
                }}
            />
        </Tabs>
        
    );
}