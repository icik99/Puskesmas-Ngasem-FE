import React from 'react';
import { IoClose } from 'react-icons/io5';
import { TbTrashOff } from 'react-icons/tb';
import { Button } from '../ui/button';

const ModalDelete = ({ activeModal, buttonClose, submitButton }) => {
  return (
    <div
      className={`${activeModal ? 'translate-y-0' : '-translate-y-[2000px]'} transition-all duration-1000 ease-in-out fixed left-0 top-0 z-50`}
    >
      <div className="h-screen w-screen bg-black backdrop-blur-sm bg-opacity-50 overflow-hidden flex items-center justify-center p-10">
        <div
          className={`max-h-[700px] overflow-auto shadow-lg bg-white rounded-[12px] px-[41px] py-[37px] scrollbar-hide w-[500px]`}
        >
          <div className="flex items-center justify-end">
            <button onClick={buttonClose}>
              <IoClose />
            </button>
          </div>
          <div className="mt-6 flex flex-col justify-center items-center gap-5">
            <TbTrashOff className="text-[120px] text-[#072B2E]" />
            <h1 className="text-center">
              Are you sure you wish to erase these records? This action is
              irreversible.
            </h1>
            <div className="flex item-center justify-center gap-3 mt-5">
              <Button
                variant="secondary"
                onClick={buttonClose}
                className=" text-sm"
              >
                Cancel
              </Button>
              <Button onClick={submitButton} className="bg-[#072B2E] text-sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
