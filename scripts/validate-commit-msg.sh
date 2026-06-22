#!/bin/bash

commit_msg=$(grep -v '^#' "$1" | head -1)

if [[ "$commit_msg" =~ ^Merge ]]; then
  exit 0
fi

pattern='^.+\[(Feat|Fix|Docs|Style|Refactor|Test|Chore)\] .+( \(#[0-9]+\))?$'

if [[ -n "$commit_msg" ]] && ! [[ "$commit_msg" =~ $pattern ]]; then
  echo ""
  echo "  ❌ 커밋 메시지 형식이 올바르지 않습니다."
  echo ""
  echo "  올바른 형식: {icon}[{type}] {message}(#{issue_num})"
  echo "  예) ✨[Feat] 로그인 기능 추가(#123)"
  echo "  예) 🐛[Fix] 로그인 버튼 오류 수정(#456)"
  echo "  예) 📝[Docs] README 업데이트"
  echo ""
  echo "  type: Feat | Fix | Docs | Style | Refactor | Test | Chore"
  echo ""
  exit 1
fi
