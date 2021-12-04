import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    Select
  } from '@chakra-ui/react'
import axios from 'axios';
import { useEffect, useState } from 'react';

  export const UpdateStatusModal = ({isOpen,onClose, selectedProject, setUpdatedProject}) => {

        const [status, setStatus] = useState(0);

        const [loading,setLoading] = useState(false);

        const handleSubmit = async e => {
            try {
                e.preventDefault();
                if(status === selectedProject.status) {
                    onClose();
                    return;
                }
                setLoading(true);
                const {data} = await client.patch("http://localhost:5000/project/requests/update",{
                    freelancerId: selectedProject.assignedTo,
                    projectId: selectedProject._id,
                    status: status
                });
                if(data) {
                    setLoading(false);
                   setUpdatedProject(data);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }

      return(
        <Modal isOpen={isOpen} onClose={() => onClose()} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Project Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb='10px'>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired textAlign={'right'}>
                    <Select placeholder='Select status' mb='10px' onChange={e => setStatus(parseInt(e.target.value))}  defaultValue={selectedProject && selectedProject.status}>
                        <option value={1}>Accepted</option>
                        <option value={2}>In progress</option>
                        <option value={3}>Completed</option>
                    </Select>
                    <Button isLoading={loading} variant='solid' colorScheme={'teal'} type="submit" ml="auto">Submit</Button>
                </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      )
  }