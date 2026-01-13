import argparse
import sys
from agents.resume_optimizer import ResumeOptimizer
from agents.job_matcher import JobMatcher
from agents.interview_prep import InterviewPrep
from agents.linkedin_generator import LinkedInGenerator

def main():
    parser = argparse.ArgumentParser(description="CareerBoost AI Multi-Agent Assistant")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Resume Optimizer
    resume_parser = subparsers.add_parser("resume", help="Optimize Resume")
    resume_parser.add_argument("--file", required=True, help="Path to resume PDF")
    resume_parser.add_argument("--target", help="Target job title")

    # Job Matcher
    matcher_parser = subparsers.add_parser("match", help="Match Job")
    matcher_parser.add_argument("--profile", required=True, help="Path to profile JSON")
    matcher_parser.add_argument("--titles", required=True, nargs="+", help="List of job titles")

    # Interview Prep
    prep_parser = subparsers.add_parser("prep", help="Interview Preparation")
    prep_parser.add_argument("--job", required=True, help="Job Title")
    prep_parser.add_argument("--company", help="Company Name")

    # LinkedIn Generator
    linkedin_parser = subparsers.add_parser("linkedin", help="Generate LinkedIn Content")
    linkedin_parser.add_argument("--topic", required=True, help="Post Topic")
    linkedin_parser.add_argument("--style", default="Professional", help="Post Style")

    args = parser.parse_args()

    if args.command == "resume":
        agent = ResumeOptimizer()
        print(agent.optimize(args.file, args.target))
    elif args.command == "match":
        agent = JobMatcher()
        print(agent.match(args.profile, args.titles))
    elif args.command == "prep":
        agent = InterviewPrep()
        print(agent.prepare(args.job, args.company))
    elif args.command == "linkedin":
        agent = LinkedInGenerator()
        print(agent.generate(args.topic, args.style))
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
