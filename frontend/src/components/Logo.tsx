import { Text } from "@chakra-ui/react"
import { shuffleArray } from "../helpers";

function Logo() {
  const text = "Inskribbl";
  const colors = shuffleArray(["red", "orange", "yellow", "green", "aqua", "blue", "indigo", "purple", "violet"]);

  return (
    <>
    {text.split('').map((char, index) => (
      <Text 
        as="span" 
        key={index} 
        color={colors[index % colors.length]}
        display="inline-block"
        transition="transform 0.3s"
        _hover={{ transform: "translateY(-5px)" }}
      >
        {char}
      </Text>
    ))}
    </>
  )
}

export default Logo
