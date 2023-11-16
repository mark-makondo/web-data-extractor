import { Modal, Input } from 'antd';

const { TextArea } = Input;

const KeywordSearch = ({ showModal, handleOk, handleCancel, setKeywords, keywords, saveKeywords }) => {
    return (
        <Modal
            className="ant-modal--keyword"
            title={<h2 style={{ color: 'white', fontWeight: '600' }}>Keywords</h2>}
            centered={true}
            visible={showModal}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}
        >
            <TextArea rows={4} value={keywords} onChange={saveKeywords} />
        </Modal>
    );
};

export default KeywordSearch;
