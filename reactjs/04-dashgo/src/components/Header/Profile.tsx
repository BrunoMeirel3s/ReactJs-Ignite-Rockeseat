import { Flex, Box, Text, Avatar } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData: boolean;
}
export function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Bruno Meireles</Text>
          <Text color="gray.300" fontSize="small">
            brunomeireles23@gmail.com
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name="Bruno Meireles"
        src="https://github.com/BrunoMeirel3s.png"
      />
    </Flex>
  );
}
