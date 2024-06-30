import { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
  useToast,
  Box,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const CongratulatoryModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        as={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition="0.3s ease-in-out"
      >
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box textAlign="center">
            <Text fontSize="2xl" mb={4}>🎉 YOU WON! 🎉</Text>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <Text fontSize="4xl">🏆</Text>
            </motion.div>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CongratulatoryModal
