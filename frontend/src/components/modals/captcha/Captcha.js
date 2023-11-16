import React from 'react';

// antd
import { Statistic, Form, Input, Button, Image, Tooltip } from 'antd';
import { Content } from 'antd/lib/layout/layout';

const { Countdown } = Statistic;

const Captcha = (props) => {
    const { selectedRecord, captchaSubmit, captchaValue, setCaptchaValue, loading, captchaTimeoutFinish } = props;
    const { date, timeout, origin, imgSrc } = selectedRecord;

    const formItemLayout = {
        labelCol: {
            span: 10,
        },
        wrapperCol: {
            span: 20,
        },
    };

    const buttonItemLayout = {
        wrapperCol: {
            span: 2,
            offset: 15,
        },
    };

    return (
        <Content className="captcha-modal">
            <div className="captcha-modal__header">
                <span className="captcha-modal__header-origin normal-2">
                    <strong>Origin: </strong>
                    <Tooltip title={origin}> {origin}</Tooltip>
                </span>

                <div className="captcha-modal__header-timer normal-2">
                    <span>
                        <strong>Duration: </strong>
                        <Countdown
                            valueStyle={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}
                            value={date + timeout * 1000}
                            onFinish={() => captchaTimeoutFinish()}
                        />
                    </span>
                </div>
            </div>

            <div className="captcha-modal__body">
                <Image width={400} src={imgSrc} alt="captcha to solve" />
                <Form {...formItemLayout} layout="inline" onSubmitCapture={(e) => captchaSubmit(e)}>
                    <Form.Item label="Captcha: ">
                        <Input
                            placeholder="Enter captcha value ..."
                            value={captchaValue}
                            onChange={(e) => setCaptchaValue(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Content>
    );
};

export default Captcha;
