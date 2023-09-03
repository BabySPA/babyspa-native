import {
  Box,
  Column,
  Row,
  Text,
  Pressable,
  Image,
  useToast,
  Spinner,
} from 'native-base';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import useManagerStore from '~/app/stores/manager';
import { DialogModal } from '~/app/components/modals';
import { useState } from 'react';
import { toastAlert } from '~/app/utils/toast';
import { useNavigation } from '@react-navigation/native';
import LabelBox from '~/app/components/label-box';
import { RoleStatus, ShopType } from '~/app/stores/manager/type';
import { generateRuleAuthText } from '~/app/utils';

interface InfoBoxParams {
  onPressEdit: () => void;
  onPressCancel: () => void;
}

export default function InfoBox(params: InfoBoxParams) {
  const { currentRole, requestDeleteRole, requestGetRoles } = useManagerStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const toast = useToast();
  const navigation = useNavigation();

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}
    >
      <Column>
        <BoxTitle
          title='角色信息'
          rightElement={
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                setIsDeleteDialogOpen(true);
              }}
              bgColor={'rgba(243, 96, 30, 0.20)'}
              borderRadius={ss(4)}
              borderWidth={1}
              borderColor={'#f3601E'}
              px={ls(26)}
              py={ss(10)}
            >
              <Row>
                {deleteLoading && <Spinner mr={ls(5)} color='#999' />}
                <Text color='#F3601E' fontSize={sp(14)}>
                  删除
                </Text>
              </Row>
            </Pressable>
          }
        />
        <Box mt={ss(30)} px={ls(20)}>
          <Row alignItems={'center'}>
            <LabelBox title='角色名称' value={currentRole?.name} />
            <LabelBox
              title='状态'
              value={currentRole.status == RoleStatus.OPEN ? '启用' : '禁用'}
            />
            <LabelBox
              title='角色类型'
              value={currentRole.type == ShopType.CENTER ? '中心' : '门店'}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='角色说明' value={currentRole?.description} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='功能权限'
              value={generateRuleAuthText(currentRole?.authorities)}
            />
          </Row>
        </Box>
      </Column>
      <Row justifyContent={'center'} mb={ss(40)}>
        <Pressable
          hitSlop={ss(10)}
          onPress={() => {
            params.onPressCancel();
          }}
        >
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(216, 216, 216, 0.10)'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#D8D8D8'}
          >
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Box>
        </Pressable>
        <Pressable
          hitSlop={ss(10)}
          ml={ls(74)}
          onPress={() => {
            params.onPressEdit();
          }}
        >
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(0, 180, 158, 0.10);'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#00B49E'}
          >
            <Text color='#00B49E' fontSize={sp(16)}>
              编辑
            </Text>
          </Box>
        </Pressable>
      </Row>
      <DialogModal
        isOpen={isDeleteDialogOpen}
        onClose={function (): void {
          setIsDeleteDialogOpen(false);
        }}
        title='是否确认删除该角色，所有配置该角色的员工可能会出现问题，请谨慎操作！'
        onConfirm={function (): void {
          setIsDeleteDialogOpen(false);
          if (deleteLoading) return;
          setDeleteLoading(true);

          requestDeleteRole()
            .then(async (res) => {
              // 取消成功
              requestGetRoles();
              toastAlert(toast, 'success', '删除角色成功！');
              navigation.goBack();
            })
            .catch((err) => {
              // 取消失败
              toastAlert(toast, 'error', '删除角色失败！');
            })
            .finally(() => {
              setDeleteLoading(false);
            });
        }}
      />
    </Column>
  );
}
