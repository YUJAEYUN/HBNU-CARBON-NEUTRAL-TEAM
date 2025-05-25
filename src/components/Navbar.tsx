"use client";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaComments, FaSeedling, FaUser, FaCamera } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { memo, useState, useEffect, useMemo, Fragment } from "react";
import styled from "styled-components";
import { Tab } from "@headlessui/react";

// 스타일드 컴포넌트 정의
const NavbarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 448px;
  z-index: 50;
`;

const NavbarInner = styled.div`
  width: 100%;
  position: relative;
`;

const NavbarBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4.5rem;
  background-color: var(--toss-white);
  border-top: 1px solid var(--toss-gray-100);
  box-shadow: var(--toss-shadow-3);
  width: 100%;
`;

const NavButtonsContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.5rem 0.5rem 1rem 0.5rem;
  z-index: 2;
`;

// 아이콘 애니메이션 설정
const iconVariants = {
  active: {
    scale: 1.2,
    y: -4,
    transition: { type: "spring", stiffness: 300 }
  },
  inactive: {
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300 }
  }
};

// 스타일드 컴포넌트 추가 정의
const NavButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  touch-action: manipulation;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.25rem 0;
`;

const IconContainer = styled(motion.div)`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  position: relative;

  @media (max-width: 360px) {
    width: 2rem;
    height: 2rem;
  }
`;

const IconBackground = styled.div<{ isActive: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--toss-radius-12);
  background-color: ${props => props.isActive ? 'var(--color-primary-light)' : 'transparent'};
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const Label = styled.p<{ isActive: boolean }>`
  font-size: 0.625rem;
  font-weight: 600;
  color: ${props => props.isActive ? 'var(--color-primary)' : 'var(--toss-gray-500)'};
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 0.5rem;
  }
`;

const TabsContainer = styled(Tab.Group)`
  width: 100%;
`;

const TabsList = styled(Tab.List)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const TabPanel = styled(Tab.Panel)`
  display: none; // 탭 패널은 표시하지 않음 (네비게이션 용도로만 사용)
`;

// 성능 최적화를 위해 memo 사용
const NavBar = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 네비게이션 항목 정의 - 컴포넌트 최상위 레벨에서 정의
  const navItems = useMemo(() => [
    {
      path: "/",
      label: "홈",
      icon: FaHome,
      isActive: pathname === "/"
    },
    {
      path: "/community",
      label: "커뮤니티",
      icon: FaComments,
      isActive: pathname.startsWith("/community")
    },
    {
      path: "/camera",
      label: "인증",
      icon: FaCamera,
      isActive: pathname.startsWith("/camera") || pathname.startsWith("/certification")
    },
    {
      path: "/character",
      label: "캐릭터",
      icon: FaSeedling,
      isActive: pathname === "/character" || pathname.startsWith("/character")
    },
    {
      path: "/dashboard",
      label: "마이",
      icon: FaUser,
      isActive: pathname === "/dashboard" || pathname.startsWith("/dashboard")
    }
  ], [pathname]);

  // 현재 경로에 따라 선택된 탭 인덱스 계산
  const currentTabIndex = useMemo(() => {
    const index = navItems.findIndex(item => item.isActive);
    return index !== -1 ? index : 0;
  }, [navItems]);

  // 선택된 탭 인덱스 업데이트
  useEffect(() => {
    if (isLoggedIn) {
      setSelectedIndex(currentTabIndex);
    }
  }, [currentTabIndex, isLoggedIn]);

  // 로그인하지 않은 상태에서는 네비게이션 바를 표시하지 않음
  if (!isLoggedIn) {
    return null;
  }

  return (
    <NavbarContainer>
      <NavbarInner>
        {/* 네비게이션 배경 - iOS 스타일 유리 효과 */}
        <NavbarBackground />

        {/* 네비게이션 버튼 - Headless UI Tab 사용 */}
        <NavButtonsContainer>
          <TabsContainer selectedIndex={currentTabIndex} onChange={(index) => {
            if (index !== currentTabIndex) {
              router.push(navItems[index].path);
            }
          }}>
            <TabsList>
              {navItems.map((item, index) => (
                <Tab key={item.path} as={Fragment}>
                  {({ selected }) => (
                    <NavButton
                      whileTap={{ scale: 0.9 }}
                      onTouchStart={() => {}} // iOS 호버 이슈 방지
                    >
                      <IconContainer
                        variants={iconVariants}
                        animate={selected ? "active" : "inactive"}
                      >
                        <IconBackground isActive={selected} />
                        <item.icon
                          style={{
                            fontSize: '1.25rem',
                            color: selected ? 'var(--color-primary)' : 'var(--toss-gray-500)',
                            position: 'relative',
                            zIndex: 1
                          }}
                        />
                      </IconContainer>
                      <Label isActive={selected}>{item.label}</Label>
                    </NavButton>
                  )}
                </Tab>
              ))}
            </TabsList>

            {/* 탭 패널 (화면에 표시되지 않음) */}
            {navItems.map((item) => (
              <TabPanel key={`panel-${item.path}`}></TabPanel>
            ))}
          </TabsContainer>
        </NavButtonsContainer>
      </NavbarInner>
    </NavbarContainer>
  );
});

export default NavBar;
