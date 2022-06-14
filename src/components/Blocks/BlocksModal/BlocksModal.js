import { useState } from 'react';
import { Badge, Button, Offcanvas } from 'react-bootstrap';
import ConfirmDialog from 'components/ConfirmDialog';
import AddItemModal from 'components/AddItemModal';

const BlocksModal = ({ data, show, onDelete, onClose }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    return (
        <>
            <Offcanvas show={show} onHide={onClose} size='lg' placement='top' className='bg-dark'>
                <Offcanvas.Header closeButton className='py-0 bg-light'>
                    <div className='d-flex justify-content-center w-100'>
                        <Offcanvas.Title>Block List</Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='container d-flex gap-2 flex-wrap'>
                        {data.map((block) => (
                            <Badge
                                key={block.title}
                                bg='danger'
                                className='p-2'
                                role='button'
                                onClick={() => {
                                    setSelectedBlock(block);
                                    setShowConfirmDialog(true);
                                }}
                            >
                                {block.title}
                            </Badge>
                        ))}
                    </div>
                </Offcanvas.Body>
                <div className='border-top my-1 py-2 px-2'>
                    <div className='d-flex justify-content-center gap-2 h-100'>
                        <Button variant='success' onClick={() => setShowAddItemModal(true)}>
                            Add Item
                        </Button>
                        <Button variant='danger' onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </Offcanvas>
            {showConfirmDialog && (
                <ConfirmDialog
                    show={showConfirmDialog}
                    onClose={() => setShowConfirmDialog(false)}
                    onConfirm={() => {
                        setShowConfirmDialog(false);
                        onDelete(selectedBlock);
                    }}
                />
            )}
            {showAddItemModal && (
                <AddItemModal
                    show={showAddItemModal}
                    onClose={() => setShowAddItemModal(false)}
                    onSubmit={(itemName) => {
                        console.log(itemName);
                        setShowAddItemModal(false);
                    }}
                />
            )}
        </>
    );
};

export default BlocksModal;
